
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'Catamaran-VariableFont_wght.ttf',
  'JosefinSans-Italic-VariableFont_wght.ttf',
  'JosefinSans-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'asterism.svg',
  'supramundane.css',
];

export default async function (opts, ctx, data) {
  const { el } = htmlHelpers(data.document);
  const { head, body } = data.document;
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`supramundane/${f}`), to);
    })
  );
  // XXX a lot of the below should be shared between themes
  el('link', { rel: 'stylesheet', href: '.nemik/css/supramundane.css' }, [], head);
  // detabbify
  let tab = body.querySelector('.tab');
  while (tab) {
    const df = data.document.createDocumentFragment();
    while (tab.hasChildNodes()) df.append(tab.firstChild);
    tab.replaceWith(df);
    tab = body.querySelector('.tab')
  }
  // mainify
  const main = el('main', {}, []);
  const header = body.querySelector('header');
  while (header.nextSibling) main.append(header.nextSibling);
  body.append(main);
  // clean
  [...body.querySelectorAll('.section-break-continuous, p:empty')].forEach(e => e.remove());
  // XXX
  // - sections
  // - everything before section is the abstract
  // - toc
}
