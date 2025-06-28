
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'JosefinSans-Italic-VariableFont_wght.ttf',
  'JosefinSans-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'asterism.svg',
  'supramundane.css',
];

export default async function (opts, ctx, data) {
  const { el } = htmlHelpers(data.document);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`supramundane/${f}`), to);
    })
  );
  el('link', { rel: 'stylesheet', href: '.nemik/css/supramundane.css' }, [], data.document.head);
}
