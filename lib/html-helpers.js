
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

  function clean () {
    [...doc.body.querySelectorAll('.section-break-continuous, p:empty')].forEach(e => e.remove());
  }

  function removeGDocIdentifiers () {
    [...doc.querySelectorAll('meta[name$="-id"]')].forEach(e => e.remove());
  }

  function svgIcon (svgStr) {
    el('link', { rel: 'icon', href: `data:image/svg+xml,${encodeURIComponent(svgStr)}` }, [], doc.head);
  }

  return ({
    el,
    textNodes,
    df,
    txt,
    linkStyle,
    detabbify,
    mainify,
    clean,
    removeGDocIdentifiers,
    svgIcon,
  });
}
