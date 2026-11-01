
import htmlHelpers from '../lib/html-helpers.js';
import makeRel from '../lib/rel.js';
import { copyThemeFiles, addMeta } from '../lib/theme-files.js';

const rel = makeRel(import.meta.url);
const files = [
  'Cormorant-VariableFont_wght.ttf',
  'Cormorant-Italic-VariableFont_wght.ttf',
  'Mulish-Italic-VariableFont_wght.ttf',
  'Mulish-VariableFont_wght.ttf',
  'academic.css',
  'academic.typ',
];

export default async function ({ author, date, appendices }, ctx, data) {
  const doc = data.document;
  const { linkStyle, detabbify, mainify, abstractify, clean, sectionify, appendixify } = htmlHelpers(doc);
  await copyThemeFiles(ctx, rel, 'academic', files);
  linkStyle('.nemik/css/academic.css');
  detabbify();
  sectionify();
  mainify();
  abstractify();
  if (appendices?.length) appendixify(appendices);
  clean();
  addMeta(doc, { author, date });

  // XXX
  // - toc
}
