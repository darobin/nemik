
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import * as citeproc from 'citeproc';
import htmlHelpers from "./html-helpers.js";
import makeRel from './rel.js';

const CSL = citeproc.default;

const rel = makeRel(import.meta.url);
const URL_PATTERN = /^https:\/\/www\.zotero\.org\/google-docs\/\?/;

export class Zotero {
  // #account;
  // #token;
  // #uid;
  // #library;
  #gdoc;
  #doc;
  #csl;
  refIDs = new Set();
  biblioData = {};
  bibliography = {};
  citedItems = {};
  constructor (data) {
    // this.#account = account;
    this.#gdoc = data.gdoc;
    this.#doc = data.dom.window.document;
  }
  async init () {
    const style = await readFile(rel('csl/chicago-author-date.csl'), 'utf8');
    const locale = await readFile(rel('csl/locales-en-US.xml'), 'utf8');
    this.#csl = new CSL.Engine(
      {
        // at some point we'll do this better
        retrieveLocale: () => {
          return locale;
        },
        retrieveItem: (id) => {
          // console.warn(`- retrieving ${id}`, this.citedItems[id]);
          return this.citedItems[id].itemData;
        }
      },
      style,
      'en',
    );
  }
  extractBibliography () {
    JSON.stringify(this.#gdoc, (k, v) => {
      // In Zotero, references are links that have an ID at the end.
      // "url": "https://www.zotero.org/google-docs/?P6eILY"
      if (k === 'url' && typeof v === 'string' && URL_PATTERN.test(v)) {
        // console.warn(`URL=${v}`);
        this.refIDs.add(v.replace(URL_PATTERN, ''));
      }
      if (k === 'namedRanges' && typeof v === 'object' && !Array.isArray(v)) {
        const assemble = {};
        Object.keys(v).forEach(key => {
          const [, id, num] = key.match(/^Z_F(.{6})(\d{3})/) || [];
          if (!id) return;
          // console.warn(`Assembly=${id}-${num}`);
          if (!assemble[id]) assemble[id] = {};
          assemble[id][num] = v[key].name.replace(/^Z_F(.{6})(\d{3})/, '');
        });
        Object.keys(assemble).forEach(id => {
          this.biblioData[id] = JSON.parse(
            Object
              .keys(assemble[id])
              .sort()
              .map(num => assemble[id][num])
              .join('')
              .replace(/^ITEM CSL_CITATION /, '')
          );
        });
      }
      return v;
    });
    // console.warn(`extractBibliography done (refs=${this.refIDs.size}, biblioData=${Object.keys(this.biblioData).length})`);
  }
  insertBibliography () {
    const { el } = htmlHelpers(this.#doc);
    const cited = new Set();
    this.refIDs.forEach(id => {
      // I think there's only one per
      const link = this.#doc.querySelector(`a[href="https://www.zotero.org/google-docs/?${id}"]`);
      const data = this.biblioData[id];
      const refs = link.textContent.replace(/^\s*\(\s*/, '').replace(/\s*\)\s*$/, '').split(/\s*;\s*/);
      const items = data.citationItems;
      if (refs.length !== items.length) {
        console.warn(`PROBLEM: references "${link.textContent}" has wrong length for id "${id}"`);
      }
      const children = ['('];
      refs.forEach((ref, idx) => {
        if (idx) children.push('; ');
        children.push(el('a', { href: `#bib-${hash(items[idx].uris[0])}`, role: "doc-biblioref"}, [ref]));
        const mergedRef = ref.replace(/\D+$/, ''); // in case there are subscripts in tab
        this.citedItems[items[idx].id] = items[idx];
        items[idx].nemikRef = mergedRef;
        if (!this.bibliography[mergedRef]) this.bibliography[mergedRef] = items[idx];
        // see if the item is any one of them, if not add it
        else if (Array.isArray(this.bibliography[mergedRef])) {
          if (!this.bibliography[mergedRef].find(r => r.uris[0] === items[idx].uris[0])) {
            this.bibliography[mergedRef].push(items[idx]);
          }
        }
        // see if it's the same, if not make an array
        else {
          if (this.bibliography[mergedRef].uris[0] !== items[idx].uris[0]) {
            this.bibliography[mergedRef] = [this.bibliography[mergedRef], items[idx]];
          }
        }
      });
      children.push(')');
      const span = el('span', { class: 'references' }, children);
      // console.warn(`updated link: ${span.outerHTML}`);
      link.replaceWith(span);
      items.forEach(it => cited.add(it.id));
    });
    this.#csl.updateItems([...cited.values()]);
    // If two tabs cite different sources with the same Author YYYY then they won't get the
    // proper a,b,… numbering.
    Object
      .keys(this.bibliography)
      .filter(k => Array.isArray(this.bibliography[k]))
      .forEach(k => {
        const items = this.bibliography[k]
          .sort((a, b) => {
            return (a.itemData?.title || a.itemData?.['title-short'] || '').localeCompare(b.itemData?.title || b.itemData?.['title-short'] || '')
          })
        ;
        // Fails if more than 26, so don't do that
        const newRefs = items.map((_, idx) => `${k}${String.fromCharCode(idx + 'a'.charCodeAt(0))}`);
        newRefs.forEach((ref, idx) => {
          const item = items[idx];
          this.bibliography[ref] = item;
          item.nemikRef = ref;
          const id = hash(item.uris[0]);
          [...this.#doc.querySelectorAll(`a[href="#bib-${id}"]`)].forEach(link => {
            link.textContent = ref;
          });
        });
        delete this.bibliography[k];
      })
    ;
    const [params, entries] = this.#csl.makeBibliography();
    const ref2entry = {};
    params.entry_ids.forEach((id, idx) => {
      ref2entry[this.citedItems[id].nemikRef] = entries[idx];
    });
    const refEls = [];
    Object
      .keys(this.bibliography)
      .sort()
      .forEach(ref => {
        const item = this.bibliography[ref];
        refEls.push(el('dt', { id: `bib-${hash(item.uris[0])}` }, [ref]));
        const dd = el('dd', {}, []);
        dd.innerHTML = ref2entry[ref];
        refEls.push(dd);
      })
    ;

    el(
      'section',
      { id: 'references', class: 'special-section', role: "doc-bibliography" },
      [
        el('h1', {}, ['References']),
        el(
          'dl',
          { class: 'bibliography' },
          refEls
        )
      ],
      this.#doc.body
    );
  }
  // async auth () {
  //   this.#token = (await getCredentials('zotero-api-key', this.#account))?.[0]?.password;
  //   if (!this.#token) throw new Error(`No account API Nkey matching "${this.#account}"`);
  //   this.#uid = (await getCredentials('zotero-user-id', this.#account))?.[0]?.password;
  //   if (!this.#token) throw new Error(`No account user ID matching "${this.#account}"`);
  //   this.#library = zotero(this.#token).library(this.#uid);
  // }
  // XXX use the token to access the API
}


// https://www.zotero.org/google-docs/?P6eILY

function hash (url) {
  return createHash('sha256').update(url).digest('hex');
}
