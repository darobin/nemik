
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';

// See https://gd3branding.wordpress.com/wp-content/uploads/2012/12/princeton.pdf
// for brand guidelines.

const rel = makeRel(import.meta.url);
const files = [
  'Monticello-Roman.ttf',
  'Monticello-Italic.ttf',
  'book.css',
];

export default async function ({ author, date, appendices }, ctx, data) {
  const doc = data.document;
  const { el, linkStyle, detabbify, mainify, abstractify, clean, sectionify, appendixify, footnotify } = htmlHelpers(doc);
  await Promise.all(
    files.map(f => {
      const to = `.nemik/${/svg|png/.test(f) ? 'img' : 'css'}/${f}`;
      return ctx.cpToRel(rel(`book/${f}`), to);
    })
  );
  linkStyle('.nemik/css/book.css');
  detabbify();
  sectionify();
  mainify();
  abstractify();
  footnotify();
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
