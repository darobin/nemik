
import jsdom from 'jsdom';
import { google } from "googleapis";
import { googleAuth } from "./credentials.js";

const { JSDOM } = jsdom;

export class GDocSource {
  #auth;
  #gdocs;
  async auth (service) {
    this.#auth = await googleAuth(service);
    this.#gdocs = google.docs({ version: "v1", auth: this.#auth });
  }
  async doc (src) {
    if (!this.#auth) throw new Error(`Need auth before you can get a doc.`);
    const res = await this.#gdocs.documents.get({ documentId: src, includeTabsContent: true });
    return res.data;
  }
}

// With help from
// https://github.com/cedricdelpoux/gatsby-source-google-docs/blob/master/utils/google-document.js
export async function toHTML (data) {
  const hc = new HTMLConverter(data);
  return await hc.convert();
}

class HTMLConverter {
  #data;
  #doc;
  #dom;
  #header;
  constructor (data) {
    this.#dom = new JSDOM(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title></title></head><body></body></html>`);
    const { window: { document } } = this.#dom;
    this.#doc = document;
    this.#data = data;
  }
  async convert () {
    const { el } = htmlHelpers(this.#doc);
    // metadata
    this.#doc.title = this.#data.title;
    el('meta', { name: 'document-id', content: this.#data.documentId }, [], this.#doc.head);
    el('meta', { name: 'revision-id', content: this.#data.revisionId }, [], this.#doc.head);
    // let's goooo
    await this.tabs(this.#data.tabs, this.#doc.body);
    return this.#dom;
  }
  async tabs (tabs, parent) {
    const { el } = htmlHelpers(this.#doc);
    for (const { tabProperties, documentTab: { body, lists, footnotes, inlineObjects }, childTabs } of tabs) {
      const tab = el('div', { id: tabProperties.tabId, title: tabProperties.title }, [], parent);
      // Here, it's possible to look at the header, including first header which can serve
      // as cover. Look at documentStyle.firstPageHeaderId and get that id from headers.
      await this.body(body, lists, tab);
      await this.footnotes(footnotes, this.#doc.body);
      await this.inlineObjects(inlineObjects);
      if (childTabs) await this.tabs(childTabs, tab);
    }
  }
  async body (body, lists, parent) {
    const { el } = htmlHelpers(this.#doc);
    for (const { paragraph, table, sectionBreak, tableOfContents } of body.content) {
      if (sectionBreak) {
        console.warn(`section-break`, JSON.stringify(sectionBreak, null, 2));
        el('div', { class: 'section-break' }, [], parent);
      }
      else if (tableOfContents) {
        console.warn(`toc`, JSON.stringify(tableOfContents, null, 2));
        el('nav', { class: 'toc' }, [], parent);
        // XXX not doing this
      }
      else if (table) {
        // not necessarily the thead
        // const [thead, ...tbody] = table.tableRows
        // this.elements.push({
        //   type: "table",
        //   value: {
        //     headers: thead.tableCells.map(({content}) =>
        //       this.getTableCellContent(content)
        //     ),
        //     rows: tbody.map((row) =>
        //       row.tableCells.map(({content}) => this.getTableCellContent(content))
        //     ),
        //   },
        // })
        //
        // getTableCellContent(content) {
        //  don't use a <p> if there's only one
        //   return content
        //     .map((contentElement) => {
        //       const hasParagraph = contentElement.paragraph

        //       if (!hasParagraph) return ""
        //       return contentElement.paragraph.elements.map(this.formatText).join("")
        //     })
        //     .join("")
        // }
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
      // XXX manage lists
      // - create ul/ol and use based on the ID
    }
    else {
      const text = [];
      for (const e of paragraph.elements) {
        await this.inlineContent(e, text);
      }
      const type = paragraph.paragraphStyle.namedStyleType;
      if (/^HEADING_/.test(type)) {
        el(`h${type.replace('HEADING_', '')}`, {}, text, parent);
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
      // XXX handle footnote
      console.warn(`footnote`, JSON.stringify(e, null, 2));
      return;
    }
    if (e.inlineObjectElement) {
      // XXX handle image
      console.warn(`image`, JSON.stringify(e, null, 2));
      return;
    }
    if (e.person) {
      // XXX handle person
      console.warn(`person`, JSON.stringify(e, null, 2));
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
    const {
      backgroundColor,
      baselineOffset,
      bold,
      fontSize,
      foregroundColor,
      italic,
      link,
      strikethrough,
      underline,
      weightedFontFamily: { fontFamily } = {},
    } = e.textRun.textStyle;
    // XXX
    // - we need to stack multiple elements I think
    // - is code if in list of monospaces
    // - baselineOffset SUPERSCRIPT / SUBSCRIPT
    // - underline and not link
    // - italic
    // - bold
    // - strikethrough
    // - foregroundColor, backgroundColor
    // - link
  }
  async footnotes (footnotes, parent) {
    // XXX make them work and manage references
  }
  async inlineObjects (inlineObjects) {
    // XXX get the content, store it locally, manage references
  }
  ensureHeader () {
    const { el } = htmlHelpers(this.#doc);
    if (!this.#header) this.#header = el('header', this.#doc.body);
  }
  // XXX
  // - preprocess lists
  // - paragraphs
  // - headings
  // - lists
  // - sectionify
}

function hasOnlyOne (key, content) {
  return content.filter(c => /\S/.test(c?.textRun?.content)).find(c => !!c[key]);
}

function htmlHelpers (doc) {
  return ({
    el: (n, attrs, kids, p) => {
      const e = doc.createElement(n);
      Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
      (kids || []).forEach(k => {
        if (typeof k === 'string') e.append(doc.createTextNode(k));
        else e.append(k);
      });
      if (p) p.append(e);
      return e;
    },
  });
}
