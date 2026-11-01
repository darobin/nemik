import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import htmlHelpers from './html-helpers.js';

// Copies a theme's support files into .nemik/: fonts under fonts/ (where the CSS looks for
// them), images under img/, stylesheets under css/, and the Typst template at the top level.
// Typst cannot use variable fonts, so the static ones are also put in fonts/static/, which is
// the compiler's font path; the variable ones have to be installed on the system.
export async function copyThemeFiles (ctx, rel, dir, files) {
  await Promise.all(
    files.map(async (f) => {
      const from = rel(`${dir}/${f}`);
      if (/\.(ttf|otf)$/i.test(f)) {
        await ctx.cpToRel(from, `.nemik/fonts/${f}`);
        if (!(await isVariableFont(from))) await ctx.cpToRel(from, `.nemik/fonts/static/${f}`);
        return;
      }
      let subtree = 'css/';
      if (/\.(svg|png|jpe?g)$/i.test(f)) subtree = 'img/';
      else if (/\.typ$/.test(f)) subtree = '';
      await ctx.cpToRel(from, `.nemik/${subtree}${f}`);
    })
  );
}

// A font is variable if its table directory has an fvar table.
async function isVariableFont (path) {
  const fh = await open(path);
  try {
    const header = Buffer.alloc(12);
    await fh.read(header, 0, 12, 0);
    const numTables = header.readUInt16BE(4);
    const records = Buffer.alloc(16 * numTables);
    await fh.read(records, 0, records.length, 12);
    for (let i = 0; i < numTables; i++) {
      if (records.toString('latin1', i * 16, i * 16 + 4) === 'fvar') return true;
    }
    return false;
  }
  finally {
    await fh.close();
  }
}

// Adds the author and date to the document header, as the themes expect them.
export function addMeta (doc, { author, date }) {
  if (!author && !date) return;
  const { el } = htmlHelpers(doc);
  const meta = el('div', { class: 'meta' }, [], doc.querySelector('header'));
  if (author) el('div', { class: 'author' }, [author], meta);
  if (date) {
    if (date === true) date = (new Date()).toISOString().replace(/T.*/, '');
    el('div', { class: 'date' }, [date], meta);
  }
}
