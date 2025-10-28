
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'JosefinSans-VariableFont_wght.ttf',
  'JosefinSans-Italic-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'logo.png',
  'supra-simple.css',
];

export default async function (opts, ctx, data) {
  const doc = data.document;
  const { linkStyle, detabbify, mainify, clean } = htmlHelpers(doc);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg|png/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`supramundane-simple/${f}`), to);
    })
  );
  linkStyle('.nemik/css/supra-simple.css');
  detabbify();
  // sectionify();
  mainify();
  // abstractify();
  clean();

  const abstract = doc.querySelector('main > p:first-of-type');
  doc.querySelector('header').after(abstract);
}
