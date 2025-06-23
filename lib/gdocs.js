
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


export function toHTML (data) {
  const dom = new JSDOM(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title></title></head><body></body></html>`);
  const { window: { document } } = dom;
  const { el } = htmlHelpers(document);
  // metadata
  document.title = data.title;
  el('meta', { name: 'document-id', content: data.documentId }, [], document.head);
  el('meta', { name: 'revision-id', content: data.revisionId }, [], document.head);
  // tabs
  data.tabs.forEach(({ tabProperties, documentTab: { body, lists }}) => {
    const tab = el('div', { id: tabProperties.tabId, title: tabProperties.title }, [], document.body);
  });
  // XXX
  // - tabs
  // - preprocess lists
  // - paragraphs
  // - headings
  // - lists
  // - sectionify
  return dom;
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
