
export default function htmlHelpers (doc) {
  function el (n, attrs, kids, p) {
    const e = doc.createElement(n);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null) return;
      e.setAttribute(k, v);
    });
    (kids || []).forEach(appendByType(e));
    if (p) p.append(e);
    return e;
  }

  function textNodes (el, exclusions = [], options = { wsNodes: true }) {
    const exclusionQuery = exclusions.join(", ");
    const { FILTER_REJECT, FILTER_ACCEPT, SHOW_TEXT } = doc.defaultView.NodeFilter;
    const acceptNode = (node) => {
      if (!options.wsNodes && !node.data.trim()) return FILTER_REJECT;
      if (exclusionQuery && node.parentElement.closest(exclusionQuery)) return FILTER_REJECT;
      return FILTER_ACCEPT;
    };
    const nodeIterator = doc.createNodeIterator(el, SHOW_TEXT, acceptNode);
    const textNodes = [];
    let node;
    while ((node = nodeIterator.nextNode())) {
      textNodes.push(node);
    }
    return textNodes;
  }

  function df (...nodes) {
    const df = doc.createDocumentFragment();
    (nodes || []).forEach(appendByType(df));
    return df;
  }

  function appendByType (parent) {
    return (n) => {
      if (typeof n === 'string') parent.append(txt(n));
      else parent.append(n);
    }
  }

  function txt (str) {
    return doc.createTextNode(str);
  }

  function linkStyle (href) {
    el('link', { rel: 'stylesheet', href }, [], doc.head);
  }

  function detabbify () {
    let tab = doc.body.querySelector('.tab');
    while (tab) {
      const d = df();
      while (tab.hasChildNodes()) d.append(tab.firstChild);
      tab.replaceWith(d);
      tab = doc.body.querySelector('.tab')
    }
  }

  function mainify (q) {
    const main = el('main', {}, []);
    const header = doc.body.querySelector(q || 'header');
    while (header.nextSibling) main.append(header.nextSibling);
    doc.body.append(main);
  }

  // expects mainify() has run first (we could probably change that)
  function abstractify () {
    // We should be able to use 'main > :has(~ h1:first-of-type)' but a bug prevents it.
    const abs = el('section', { id: 'abstract', class: 'special-section' });
    const main = doc.body.querySelector('main');
    while (main.firstChild && !/h1|section/.test(main.firstChild.localName)) abs.append(main.firstChild);
    main.prepend(abs);
  }

  function clean () {
    [...doc.body.querySelectorAll('.section-break-continuous, p:empty')].forEach(e => e.remove());
  }

  function removeGDocIdentifiers () {
    [...doc.querySelectorAll('meta[name$="-id"]')].forEach(e => e.remove());
  }

  function svgIcon (svgStr) {
    el('link', { rel: 'icon', href: `data:image/svg+xml,${encodeURIComponent(svgStr)}` }, [], doc.head);
  }

  function sectionify () {
    const elem = doc.body;
    const structuredInternals = structure(elem);
    if (
      structuredInternals.firstElementChild.localName === "section" &&
      elem.localName === "section"
    ) {
      const section = structuredInternals.firstElementChild;
      section.remove();
      elem.append(...section.childNodes);
    }
    else {
      elem.textContent = "";
    }
    elem.appendChild(structuredInternals);
  }

  return ({
    el,
    textNodes,
    df,
    txt,
    linkStyle,
    detabbify,
    mainify,
    abstractify,
    clean,
    removeGDocIdentifiers,
    svgIcon,
    sectionify,
  });
}


// This borrows heavily from https://github.com/w3c/respec/blob/main/src/core/sections.js
// See https://github.com/w3c/respec/blob/main/LICENSE

class DOMBuilder {
  constructor (doc) {
    this.doc = doc;
    this.root = doc.createDocumentFragment();
    this.stack = [this.root];
    this.current = this.root;
  }
  findPosition (header) {
    return parseInt(header.tagName.charAt(1), 10);
  }
  findParent (position) {
    let parent;
    while (position > 0) {
      position--;
      parent = this.stack[position];
      if (parent) return parent;
    }
  }
  findHeader ({ firstChild: node }) {
    while (node) {
      if (/H[1-6]/.test(node.tagName)) return node;
      node = node.nextSibling;
    }
    return null;
  }

  addHeader(header) {
    const section = this.doc.createElement("section");
    const position = this.findPosition(header);
    section.appendChild(header);
    this.findParent(position).appendChild(section);
    this.stack[position] = section;
    this.stack.length = position + 1;
    this.current = section;
  }

  addSection(node) {
    const header = this.findHeader(node);
    const position = header ? this.findPosition(header) : 1;
    const parent = this.findParent(position);
    if (header) node.removeChild(header);
    node.appendChild(structure(node));
    if (header) node.prepend(header);
    parent.appendChild(node);
    this.current = parent;
  }

  addElement(node) {
    this.current.appendChild(node);
  }
}


function structure (fragment) {
  const builder = new DOMBuilder(fragment.ownerDocument);
  while (fragment.firstChild) {
    const node = fragment.firstChild;
    switch (node.localName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        builder.addHeader(node);
        break;
      case "section":
        builder.addSection(node);
        break;
      default:
        builder.addElement(node);
    }
  }
  return builder.root;
}
