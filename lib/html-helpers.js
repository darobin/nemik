
export default function htmlHelpers (doc) {
  return ({
    el: (n, attrs, kids, p) => {
      const e = doc.createElement(n);
      Object.entries(attrs || {}).forEach(([k, v]) => {
        if (v == null) return;
        e.setAttribute(k, v);
      });
      (kids || []).forEach(k => {
        if (typeof k === 'string') e.append(doc.createTextNode(k));
        else e.append(k);
      });
      if (p) p.append(e);
      return e;
    },
    textNodes: (el, exclusions = [], options = { wsNodes: true }) => {
      const exclusionQuery = exclusions.join(", ");
      const NodeFilter = doc.defaultView.NodeFilter;
      const acceptNode = (node) => {
        if (!options.wsNodes && !node.data.trim()) return NodeFilter.FILTER_REJECT;
        if (exclusionQuery && node.parentElement.closest(exclusionQuery)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      };
      const nodeIterator = doc.createNodeIterator(
        el,
        NodeFilter.SHOW_TEXT,
        acceptNode
      );
      const textNodes = [];
      let node;
      while ((node = nodeIterator.nextNode())) {
        textNodes.push(node);
      }
      return textNodes;
    },
    df: (...nodes) => {
      const df = doc.createDocumentFragment();
      nodes.forEach(n => {
        if (typeof n === 'string') df.append(doc.createTextNode(n));
        else df.append(n);
      });
      return df;
    },
    txt: (str) => {
      return doc.createTextNode(str);
    }
  });
}
