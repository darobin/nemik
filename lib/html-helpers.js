
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
  });
}
