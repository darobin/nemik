
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import * as citeproc from 'citeproc';
import htmlHelpers from "./html-helpers.js";
import makeRel from './rel.js';

const CSL = citeproc.default;

const rel = makeRel(import.meta.url);
const URL_PATTERN = /^https:\/\/www\.zotero\.org\/google-docs\/\?/;
// In an author-date style, the key of a citation ("Slobodian 2020") ends with a year,
// possibly followed by a disambiguating letter, or with "n.d."
const ANY_YEAR = String.raw`(?:\d{4}|n\.d\.)`;
const COLLAPSED_YEAR = new RegExp(String.raw`^\s*,\s*(${ANY_YEAR})([a-z])?(?!\w)([\s\S]*)$`);
const YEAR_LETTER = new RegExp(String.raw`(${ANY_YEAR})[a-z]?$`);

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
  // Cited works, keyed by the hash of their Zotero URI. Zotero's numeric item ids are local
  // to one machine: the same work can carry different ids in different citations, and
  // different works can share an id.
  works = {};
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
          return this.works[id].itemData;
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
    this.refIDs.forEach(id => {
      const link = this.#doc.querySelector(`a[href="https://www.zotero.org/google-docs/?${id}"]`);
      const items = this.biblioData[id]?.citationItems;
      if (!link || !items) {
        console.warn(`PROBLEM: Zotero citation "${id}" has no ${link ? 'data' : 'link'}`);
        return;
      }
      // Zotero can split the text of one citation over several links
      while (link.nextSibling?.localName === 'a' && link.nextSibling.getAttribute('href') === link.getAttribute('href')) {
        link.textContent += link.nextSibling.textContent;
        link.nextSibling.remove();
      }
      const segments = parseCitation(link.textContent, items);
      if (segments.length !== items.length) {
        console.warn(`PROBLEM: citation "${link.textContent}" (${id}) has ${items.length} works but ${segments.length} could be parsed`);
      }
      const children = ['('];
      segments.forEach(({ item, text, pre, post }, idx) => {
        if (idx) children.push('; ');
        const work = this.#work(item);
        const a = el('a', { href: `#bib-${work.id}`, role: "doc-biblioref" }, [text]);
        const suppressed = !!item['suppress-author'];
        work.links.push({ a, suppressed });
        if (!suppressed) {
          // how Zotero rendered this work, minus any year letter
          const key = text.replace(YEAR_LETTER, '$1');
          work.keys.set(key, (work.keys.get(key) || 0) + 1);
        }
        if (pre) children.push(pre);
        children.push(a);
        if (post) children.push(post);
      });
      children.push(')');
      link.replaceWith(el('span', { class: 'references' }, children));
    });
    const works = Object.values(this.works);
    this.#csl.updateItems(works.map(w => w.id));
    // Each work is keyed the way Zotero rendered it in the text: the most frequent form wins,
    // then the longest, in case tabs disambiguated it differently ("D. Srinivasan 2019" vs
    // "Srinivasan 2019"). Works only ever cited with the author suppressed get rendered here.
    works.forEach(work => {
      if (work.keys.size > 1) {
        console.warn(`PROBLEM: the same Zotero item is cited as ${[...work.keys.keys()].map(k => `"${k}"`).join(' and ')}; refresh the citations in Zotero`);
      }
      const [key] = [...work.keys.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0] || [];
      work.base = key || this.#renderKey(work.id);
    });
    const [params, entries] = this.#csl.makeBibliography();
    params.entry_ids.forEach((ids, idx) => {
      [].concat(ids).forEach(id => {
        if (this.works[id]) this.works[id].entry = entries[idx];
      });
    });
    // Works that share an Author Year get letters. Citeproc assigns them while making the
    // bibliography, so that the key matches the entry; if it didn't, sort by title.
    const groups = {};
    works.forEach(w => (groups[w.base] ||= []).push(w));
    Object.values(groups).forEach(group => {
      if (group.length === 1) {
        group[0].key = group[0].base;
        return;
      }
      const suffixes = group.map(w => this.#csl.registry.registry[w.id]?.disambig?.year_suffix);
      if (suffixes.every(s => /^\d+$/.test(s))) {
        group.forEach((w, idx) => { w.key = `${w.base}${letter(Number(suffixes[idx]))}`; });
      }
      else {
        // Fails if more than 26, so don't do that
        group.sort(byTitle).forEach((w, idx) => { w.key = `${w.base}${letter(idx)}`; });
      }
    });
    // Make the text citations match the bibliography
    works.forEach(work => {
      const suffix = work.key.slice(work.base.length);
      work.links.forEach(({ a, suppressed }) => {
        if (suppressed) a.textContent = a.textContent.replace(YEAR_LETTER, `$1${suffix}`);
        else a.textContent = work.key;
      });
    });
    const refEls = [];
    works
      .sort((a, b) => a.key.localeCompare(b.key))
      .forEach(work => {
        if (!work.entry) console.warn(`PROBLEM: no bibliography entry for "${work.key}"`);
        refEls.push(el('dt', { id: `bib-${work.id}` }, [work.key]));
        const dd = el('dd', {}, []);
        dd.innerHTML = work.entry || '';
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
  #work (item) {
    const uri = item.uris[0];
    const id = hash(uri);
    if (!this.works[id]) {
      this.works[id] = { id, uri, itemData: { ...item.itemData, id }, links: [], keys: new Map() };
    }
    return this.works[id];
  }
  // How the style cites this work, minus parentheses, locators, and year letters
  #renderKey (id) {
    const citation = { citationItems: [{ id }], properties: { noteIndex: 0 } };
    const text = this.#csl.previewCitationCluster(citation, [], [], 'text').replace(/^\(\s*/, '').replace(/\s*\)$/, '');
    return text.match(keyPattern())?.[1] || text;
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

// Splits the text of a Zotero citation into one segment per cited work: the text to link
// ("Slobodian 2020"), what precedes it (a prefix such as "cited in "), and what follows it
// (a locator or suffix such as ", 45" or ", emphasis in original").
function parseCitation (text, items) {
  const inner = text.trim().replace(/^\(\s*/, '').replace(/\s*\)$/, '');
  const segments = [];
  let idx = 0;
  for (let group of inner.split(/\s*;\s*/)) {
    if (idx >= items.length) break;
    const item = items[idx++];
    let pre = '';
    const prefix = plainText(item.prefix);
    if (prefix && group.startsWith(prefix)) {
      pre = `${prefix} `;
      group = group.slice(prefix.length).trimStart();
    }
    const match = group.match(keyPattern(escapeRegExp(yearOf(item.itemData)))) || group.match(keyPattern());
    if (!match) {
      segments.push({ item, text: group, pre, post: '' });
      continue;
    }
    const [, key, yearLetter = '', rest] = match;
    let last = { item, text: `${key}${yearLetter}`, pre, post: '' };
    segments.push(last);
    // Zotero collapses consecutive works by the same author: "(Khan 2016, 2019)"
    const name = key.replace(new RegExp(String.raw`\s*${ANY_YEAR}$`), '');
    let tail = rest;
    while (idx < items.length) {
      const collapsed = tail.match(COLLAPSED_YEAR);
      if (!collapsed || collapsed[1] !== yearOf(items[idx].itemData)) break;
      last = { item: items[idx++], text: `${name} ${collapsed[1]}${collapsed[2] || ''}`.trim(), pre: '', post: '' };
      segments.push(last);
      tail = collapsed[3];
    }
    last.post = tail;
  }
  return segments;
}

// Matches a citation key ending with the given year (any year by default): the key with
// the year, the disambiguating letter if any, and whatever follows.
function keyPattern (year = ANY_YEAR) {
  return new RegExp(String.raw`^(.*?(?:^|\s)${year})([a-z])?(?!\w)([\s\S]*)$`);
}

function yearOf (itemData) {
  const year = itemData?.issued?.['date-parts']?.[0]?.[0];
  return year ? String(year) : 'n.d.';
}

function plainText (str) {
  return (str || '').replace(/<[^>]*>/g, '').trim();
}

function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function letter (idx) {
  return String.fromCharCode('a'.charCodeAt(0) + idx);
}

function byTitle (a, b) {
  const title = (w) => w.itemData.title || w.itemData['title-short'] || '';
  return title(a).localeCompare(title(b));
}

// https://www.zotero.org/google-docs/?P6eILY

function hash (url) {
  return createHash('sha256').update(url).digest('hex');
}
