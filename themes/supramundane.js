
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'Catamaran-VariableFont_wght.ttf',
  'Cormorant-VariableFont_wght.ttf',
  'Cormorant-Italic-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  // 'asterism.svg',
  'asterism.png',
  'supramundane.css',
];

// cover: 'ernst-haeckel.png',
// date: true,
// author: 'Robin Berjon',

export default async function ({ cover, author, date, appendices, noAbstract }, ctx, data) {
  const doc = data.document;
  const { el, linkStyle, detabbify, mainify, abstractify, clean, sectionify, appendixify, footnotify } = htmlHelpers(doc);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg|png/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`supramundane/${f}`), to);
    })
  );
  linkStyle('.nemik/css/supramundane.css');
  detabbify();
  sectionify();
  mainify();
  abstractify();
  if (noAbstract) doc.body.classList.add('no-abstract');
  footnotify();
  if (appendices?.length) appendixify(appendices);
  clean();

  // Inject logo so it can be reused
  // const asterism = await readFile(rel('supramundane/asterism.svg'));
  // const div = el('div');
  // div.innerHTML = asterism;
  // doc.body.prepend(div.firstChild);

  // Apply theme options
  const header = doc.querySelector('header');
  if (cover) {
    // doing it this way because I couldn't get variables to work right
    el('style', {}, [`@page :first { background-image: url(${cover}); }`], doc.head);
  }
  else {
    doc.body.classList.add('no-cover');
  }
  if (author || date) {
    const meta = el('div', { class: 'meta' }, [], header);
    if (author) el('div', { class: 'author' }, [author], meta);
    if (date) {
      if (date === true) {
        date = (new Date()).toISOString().replace(/T.*/, '');
      }
      el('div', { class: 'date' }, [date], meta);
    }
  }
  const imp = el('div', { class: 'imprimatur', style: "--color: #000; --zoom: 1" }, [], header);
  imp.innerHTML = `<img src=".nemik/img/asterism.png" alt="abstract shape"><div>supramundane <em>agency</em>.</div>`;


  // XXX
  // - closing page with big ass logo
  // - toc
}
