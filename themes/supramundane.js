
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'Catamaran-VariableFont_wght.ttf',
  'Cormorant-VariableFont_wght.ttf',
  'Cormorant-Italic-VariableFont_wght.ttf',
  'JosefinSans-Italic-VariableFont_wght.ttf',
  'JosefinSans-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  // 'asterism.svg',
  'supramundane.css',
];

// cover: 'ernst-haeckel.png',
// date: true,
// author: 'Robin Berjon',

export default async function ({ cover, author, date }, ctx, data) {
  const doc = data.document;
  const { el, linkStyle, detabbify, mainify, clean } = htmlHelpers(doc);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`supramundane/${f}`), to);
    })
  );
  linkStyle('.nemik/css/supramundane.css');
  detabbify();
  mainify();
  clean();
  // Apply theme options
  if (cover) {
    // doing it this way because I couldn't get variables to work right
    el('style', {}, [`@page :first { background-image: url(${cover}); }`], doc.head);
  }
  if (author || date) {
    const meta = el('div', { class: 'meta' }, [], doc.querySelector('header'));
    if (author) el('div', { class: 'author' }, [author], meta);
    if (date) {
      if (date === true) {
        date = (new Date()).toISOString().replace(/T.*/, '');
      }
      el('div', { class: 'date' }, [date], meta);
    }
  }
  // XXX
  // - front page
  //  X use image if available (set as var)
  //  - big title + subtitle
  //  - author + date
  //  - all other content pushed down
  //  - skip blank page
  //  - bottom banner with logo
  // - inject quasi logo as SVG in there
  // - sections
  // - everything before section is the abstract
  // - toc
}
