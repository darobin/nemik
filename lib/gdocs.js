
import { createHash } from 'crypto';
import jsdom from 'jsdom';
import { google } from "googleapis";
import { googleAuth, getGoogleCredentials, generateGoogleToken } from "./credentials.js";
import htmlHelpers from './html-helpers.js';

const { JSDOM } = jsdom;
const monospaces = new Set(['Courier New']);
const ordered = new Set(['DECIMAL', 'ALPHA', 'ROMAN']);

export class GDocSource {
  #auth;
  #gdocs;
  #service;
  async auth (service) {
    this.#service = service;
    this.#auth = await googleAuth(service);
    this.#gdocs = google.docs({ version: "v1", auth: this.#auth });
  }
  async doc (src) {
    if (!this.#auth) throw new Error(`Need auth before you can get a doc.`);
    try {
      const res = await this.#gdocs.documents.get({ documentId: src, includeTabsContent: true });
      return res.data;
    }
    catch (err) {
      if (err.message === 'No refresh token is set.' && this.#service) {
        const { clientId, clientSecret } = await getGoogleCredentials(this.#service);
        await generateGoogleToken(this.#service, clientId, clientSecret);
      }
    }
  }
}

// With help from
// https://github.com/cedricdelpoux/gatsby-source-google-docs/blob/master/utils/google-document.js
export async function toHTML (data, ctx) {
  const hc = new HTMLConverter(data, ctx);
  return await hc.convert();
}

class HTMLConverter {
  #data;
  #doc;
  #dom;
  #header;
  #footnoteOrder;
  #ctx;
  #lists;
  #listStacks;
  constructor (data, ctx) {
    this.#dom = new JSDOM(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title></title></head><body></body></html>`);
    const { window: { document } } = this.#dom;
    this.#doc = document;
    this.#data = data;
    this.#ctx = ctx;
    this.#footnoteOrder = [];
    this.#lists = {};
    this.#listStacks = {};
  }
  async convert () {
    const { el } = htmlHelpers(this.#doc);
    // metadata
    this.#doc.title = this.#data.title;
    el('meta', { name: 'document-id', content: this.#data.documentId }, [], this.#doc.head);
    el('meta', { name: 'revision-id', content: this.#data.revisionId }, [], this.#doc.head);
    // let's goooo
    await this.tabs(this.#data.tabs, this.#doc.body);
    await this.postProcessLists();
    return this.#dom;
  }
  async tabs (tabs, parent) {
    const { el } = htmlHelpers(this.#doc);
    for (const { tabProperties, documentTab: { body, lists, footnotes, inlineObjects }, childTabs } of tabs) {
      this.#footnoteOrder = [];
      this.#lists = lists;
      const tab = el('div', { id: tabProperties.tabId, title: tabProperties.title }, [], parent);
      // Here, it's possible to look at the header, including first header which can serve
      // as cover. Look at documentStyle.firstPageHeaderId and get that id from headers.
      await this.body(body, tab);
      if (footnotes) await this.footnotes(footnotes, tab);
      if (inlineObjects) await this.inlineObjects(inlineObjects);
      if (childTabs) await this.tabs(childTabs, tab);
    }
  }
  async body (body, parent) {
    const { el } = htmlHelpers(this.#doc);
    for (const { paragraph, table, sectionBreak, tableOfContents } of body.content) {
      if (sectionBreak) {
        const type = sectionBreak.sectionStyle.sectionType.toLowerCase();
        el('div', { class: `section-break section-break-${type}` }, [], parent);
      }
      else if (tableOfContents) {
        // XXX
        // - the data we get isn't good
        // - generate it in post-processing
        // - have the print system make its own page numbers
        el('nav', { class: 'toc' }, [], parent);
      }
      else if (table) {
        const tbl = el('table', {}, [], parent);
        const rows = table.tableRows;
        // As far as I can tell, in gdocs a table header is actually a caption
        if (rows[0]?.tableRowStyle?.tableHeader) {
          const headRow = rows.shift();
          if (headRow.tableCells.length > headRow.tableCells[0].tableCellStyle.columnSpan) {
            this.#ctx.warn(`Table header/caption has ${headRow.tableCells.length} cells.`);
          }
          const cap = el('caption', {}, [], tbl);
          for (const { paragraph } of headRow.tableCells[0].content) {
            await this.paragraph(paragraph, cap);
          }
        }
        let curRow = -1;
        const skipRowCell = {};
        for (const row of rows) {
          curRow++;
          const tr = el('tr', {}, [], tbl);
          let skipCols = 0;
          let curCell = -1;
          for (const cell of row.tableCells) {
            curCell++;
            if (skipCols) {
              skipCols--;
              continue;
            }
            if (skipRowCell[`${curRow}|${curCell}`]) continue;
            const rowspan = cell.tableCellStyle.rowSpan > 1 ? cell.tableCellStyle.rowSpan : undefined;
            const colspan = cell.tableCellStyle.columnSpan > 1 ? cell.tableCellStyle.columnSpan : undefined;
            if (colspan) skipCols = colspan - 1;
            if (rowspan) {
              const skipCells = colspan || 1;
              for (let r = curRow + 1; r < curRow + rowspan; r++) {
                for (let c = 0; c < skipCells; c++) {
                  skipRowCell[`${r}|${c + curCell}`] = true;
                }
              }
            }
            const td = el('td', { rowspan, colspan }, [], tr);
            // If there's only one element, we include its content directly.
            // We should probably check that this is a graf
            if (cell.content.length === 1) {
              const text = [];
              for (const e of cell.content[0].paragraph.elements) {
                await this.inlineContent(e, text);
              }
              if (!text.length) text.push('\u00a0');
              td.append(...text);
            }
            // if there are several, we go to the content
            else if (cell.content.length) {
              for (const { paragraph } of cell.content) {
                await this.paragraph(paragraph, td);
              }
            }
            // if there's nothing, we need a &nbsp;
            else {
              td.append(this.#doc.createTextNode('\u00a0'));
            }
          }
        }
      }
      else {
        await this.paragraph(paragraph, parent);
      }
    }
  }
  async paragraph (paragraph, parent) {
    const { el } = htmlHelpers(this.#doc);
    if (hasOnlyOne('horizontalRule', paragraph.elements)) {
      el('hr', {}, [], parent);
    }
    else if (hasOnlyOne('pageBreak', paragraph.elements)) {
      el('div', { class: 'page-break' }, [], parent);
    }
    else if (paragraph.bullet) {
      const list = this.ensureList(paragraph.bullet, parent);
      const text = [];
      if (this.#lists?.[paragraph.bullet.listId]?.listProperties?.nestingLevels?.[paragraph.bullet.nestingLevel || 0]?.glyphType === 'GLYPH_TYPE_UNSPECIFIED') {
        text.push(el('input', { type: 'checkbox' }), ' ');
      }
      for (const e of paragraph.elements) {
        await this.inlineContent(e, text);
      }
      el('li', {}, text, list);
    }
    else {
      const text = [];
      for (const e of paragraph.elements) {
        await this.inlineContent(e, text);
      }
      const type = paragraph.paragraphStyle.namedStyleType;
      if (/^HEADING_/.test(type)) {
        el(`h${type.replace('HEADING_', '')}`, { id: paragraph.paragraphStyle.headingId }, text, parent);
      }
      else if (type === 'TITLE') {
        this.ensureHeader();
        el('p', { class: 'title' }, text, this.#header);
      }
      else if (type === 'SUBTITLE') {
        this.ensureHeader();
        el('p', { class: 'subtitle' }, text, this.#header);
      }
      else {
        el('p', {}, text, parent);
      }
    }
  }
  async inlineContent (e, run) {
    const { el } = htmlHelpers(this.#doc);
    if (e.footnoteReference) {
      const id = e.footnoteReference.footnoteId;
      const num = e.footnoteReference.footnoteNumber;
      const fn = el('a',
        {
          href: `#${id}`,
          id: `fnref-${id}`,
          role: "doc-noteref",
        },
        [el('sup', {}, [num])]
      );
      this.#footnoteOrder[parseInt(num, 10) - 1] = id;
      run.push(fn);
      return;
    }
    if (e.inlineObjectElement) {
      run.push(el('span', { 'data-io': e.inlineObjectElement.inlineObjectId }));
      return;
    }
    if (e.person) {
      run.push(el('span', { class: 'person' }, [e.person.personProperties.name]));
      return;
    }
    // XXX it's not clear how dates get represented
    if (e.richLink) {
      // XXX handle rich link
      console.warn(`rich link`, JSON.stringify(e, null, 2));
      return;
    }
    if (!e.textRun?.content?.trim()) {
      return;
    }
    // This eliminates suggested insertions and keeps suggested deletions.
    // We could have multiple modes for this.
    if (e.textRun.suggestedInsertionIds) return;
    const text = e.textRun.content;
    const parts = text.split("\u000b");
    const cloneWithText = (txt) => {
      const obj = structuredClone(e);
      e.textRun.content = txt;
      return obj;
    };
    if (parts.length > 1) {
      await this.inlineContent(cloneWithText(parts.shift()), run);
      for (const part of parts) {
        run.push(el('br'));
        await this.inlineContent(cloneWithText(part), run);
      }
      return;
    }
    // XXX if we care some day
    // - foregroundColor, backgroundColor
    const {
      // backgroundColor,
      baselineOffset,
      bold,
      // fontSize,
      // foregroundColor,
      italic,
      link,
      strikethrough,
      underline,
      weightedFontFamily: { fontFamily } = {},
    } = e.textRun.textStyle;
    const stack = [];
    if (baselineOffset === 'SUPERSCRIPT') stack.push(el('sup'));
    if (baselineOffset === 'SUBSCRIPT') stack.push(el('sub'));
    if (underline && !link) stack.push(el('u'));
    if (italic) stack.push(el('em'));
    if (bold) stack.push(el('strong'));
    if (strikethrough) stack.push(el('del'));
    if (monospaces.has(fontFamily)) stack.push(el('code'));
    if (link) {
      if (link.url) stack.push(el('a', { href: link.url }));
      else if (link.heading) stack.push(el('a', { href: `#${link.heading.id}` }));
      else if (link.tabId) stack.push(el('a', { href: `#${link.tabId}` }));
      else console.warn(`Unknown link type:`, JSON.stringify(link));
    }
    let leaf = this.#doc.createTextNode(text);
    while (stack.length) {
      const next = stack.shift();
      next.append(leaf);
      leaf = next;
    }
    run.push(leaf);
  }
  async footnotes (footnotes, parent) {
    const { el } = htmlHelpers(this.#doc);
    const section = el('section', { role: 'doc-endnotes' }, [], parent);
    let idx = 0;
    for (const id of this.#footnoteOrder) {
      idx++;
      const aside = el(
        'aside',
        {
          id,
          role: 'doc-footnote',
        },
        [el('a', { href: `#fnref-${id}`, class: 'fn' }, [el('sup', {}, [`⇖ ${idx}`])])],
        section
      );
      for (const { paragraph } of footnotes[id].content) {
        await this.paragraph(paragraph, aside);
      }
    }
  }
  async inlineObjects (inlineObjects) {
    const { el } = htmlHelpers(this.#doc);
    // XXX get the content, store it locally, manage references
    // run.push(el('span', { 'data-io': e.inlineObjectElement.inlineObjectId }));
    const downloads = [];
    [...this.#doc.querySelectorAll('span[data-io]')].forEach(span => {
      const id = span.getAttribute('data-io');
      const eo = inlineObjects?.[id]?.inlineObjectProperties?.embeddedObject;
      const imageProperties = eo?.imageProperties;
      if (!imageProperties) {
        console.warn(`Unknown inline object ID ${id}`);
        return;
      }
      const url = imageProperties.contentUri;
      const hash = createHash('sha256').update(url).digest('hex');
      const src = `.nemik/img/${hash}`;
      downloads.push({ url, hash, src });
      const img = el('img', { src, alt: eo.description || '', title: eo.title || '' }, []);
      span.replaceWith(img);
    });
    // XXX this assumes that we don't need to make media type to extension
    await Promise.all(
      downloads.map(({ url, src }) => this.#ctx.downloadToRel(url, src))
    );
  }
  ensureHeader () {
    const { el } = htmlHelpers(this.#doc);
    if (!this.#header) {
      this.#header = el('header');
      this.#doc.body.prepend(this.#header);
    }
  }
  ensureList (bullet, parent) {
    const { el } = htmlHelpers(this.#doc);
    const id = bullet.listId;
    const depth = bullet.nestingLevel || 0;
    if (!this.#listStacks[id]) this.#listStacks[id] = [];
    const stack = this.#listStacks[id];
    const curDepth = stack.length - 1;
    if (curDepth < depth) {
      let d = curDepth;
      while (d < depth) {
        d++;
        const type = this.#lists[id]?.listProperties?.nestingLevels?.[d]?.glyphType;
        const lt = (ordered.has(type)) ? 'ol' : 'ul';
        // NOTE: this puts list containers inside the previous list container.
        // It requires a post-processing step.
        stack.push(el(lt, {}, [], d ? stack[d - 1] : parent));
      }
    }
    else if (curDepth > depth) stack.length = depth + 1;
    return stack[stack.length - 1];
  }
  async postProcessLists () {
    const { el } = htmlHelpers(this.#doc);
    [...this.#doc.querySelectorAll('ul, ol')].forEach(le => {
      const prev = le.previousElementSibling;
      if (!prev && /^(u|o)l$/.test(le.parentNode?.localName)) {
        const li = el('li', {}, [], le.parentNode);
        li.append(le);
      }
      if (prev.localName === 'li') prev.append(le);
    });
  }
}

function hasOnlyOne (key, content) {
  return content.filter(c => /\S/.test(c?.textRun?.content)).find(c => !!c[key]);
}
