
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';
import { copyThemeFiles, addMeta } from '../lib/theme-files.js';

const rel = makeRel(import.meta.url);
const files = [
  'JosefinSans-VariableFont_wght.ttf',
  'JosefinSans-Italic-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'logo.png',
  'sky.css',
  'eurosky.typ',
];

export default async function ({ author, date } = {}, ctx, data) {
  const doc = data.document;
  const { el, linkStyle, detabbify, mainify, clean } = htmlHelpers(doc);
  await copyThemeFiles(ctx, rel, 'eurosky', files);
  linkStyle('.nemik/css/sky.css');
  detabbify();
  // sectionify();
  mainify();
  clean();
  addMeta(doc, { author, date });

  // The first paragraph is the abstract: it goes under the title, across the columns.
  const abstract = doc.querySelector('main > p:first-of-type');
  if (abstract) {
    const section = el('section', { id: 'abstract', class: 'special-section' }, [abstract]);
    doc.querySelector('header').after(section);
  }
}
