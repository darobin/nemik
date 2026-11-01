
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';
import { copyThemeFiles, addMeta } from '../lib/theme-files.js';

// See https://gd3branding.wordpress.com/wp-content/uploads/2012/12/princeton.pdf
// for brand guidelines.

const rel = makeRel(import.meta.url);
const files = [
  'Monticello-Roman.ttf',
  'Monticello-Italic.ttf',
  'book.css',
  'book.typ',
];

export default async function ({ author, date, appendices }, ctx, data) {
  const doc = data.document;
  const { linkStyle, detabbify, mainify, abstractify, clean, sectionify, appendixify, footnotify } = htmlHelpers(doc);
  await copyThemeFiles(ctx, rel, 'book', files);
  linkStyle('.nemik/css/book.css');
  detabbify();
  sectionify();
  mainify();
  abstractify();
  footnotify();
  if (appendices?.length) appendixify(appendices);
  clean();
  addMeta(doc, { author, date });

  // XXX
  // - toc
}
