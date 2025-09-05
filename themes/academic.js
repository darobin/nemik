
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

const rel = makeRel(import.meta.url);
const files = [
  'Cormorant-VariableFont_wght.ttf',
  'Cormorant-Italic-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'academic.css',
];

export default async function ({ author, date, appendices }, ctx, data) {
  const doc = data.document;
  const { el, linkStyle, detabbify, mainify, abstractify, clean, sectionify, appendixify } = htmlHelpers(doc);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg|png/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`academic/${f}`), to);
    })
  );
  linkStyle('.nemik/css/academic.css');
  detabbify();
  sectionify();
  mainify();
  abstractify();
  if (appendices?.length) appendixify(appendices);
  clean();

  // Apply theme options
  const header = doc.querySelector('header');
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

  // XXX
  // - toc
}
