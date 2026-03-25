
import { writeFile } from "node:fs/promises";
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import chalk from "chalk";

export async function generateTypst (data, outTypst, outPDF, workspace) {
  const out = [];
  walkEl(data.document.documentElement, {
    out,
    theme: data.theme || { options: {} },
  });
  const mainFileContent = out.join("\n");
  await writeFile(outTypst, mainFileContent, "utf-8");
  const typst = NodeCompiler.create({ workspace });
  const pdf = typst.pdf({ mainFilePath: outTypst });
  await writeFile(outPDF, pdf);
}

// XXX
//  - page numbering and header/footer
const CLOSE = `"")+`;
const CLOSE_ITEM = `""),`;
const CLOSE_ITEMS = ') +';
function walkEl (el, ctx) {
  const { out, theme } = ctx;
  const n = el.localName;
  let absOut = [];
  switch (n) {
    case "html":
      walkChildren(el.querySelector('#abstract'), { theme, out: absOut});
      out.push(
        `#import ".nemik/${theme.name}.typ" : article`,
        [
          `#show: article.with(cover: "../${esc(theme.options.cover)}", `,
          `title: "${esc(el.querySelector('.title').textContent)}", `,
          `subtitle: "${esc(el.querySelector('.subtitle').textContent)}", `,
          `author: "${esc(el.querySelector('.meta .author').textContent)}", `,
          `date: "${esc(el.querySelector('.meta .date').textContent)}", `,
          `dt: ${datetime(theme.options.date)}, `,
          `abstract: {${absOut.join(' ')} ""}, `,
          `)`].join(''),
        "#{",
        `let references(b) = { text(b) }`,
      );
      walkChildren(el, ctx);
      out.push(`}`, "");
      break;
    case "body":
      // out.push('body(');
      out.push('(');
      walkChildren(el, ctx);
      out.push('"")');
      break;
    case "main":
    case "section":
      if (el.id === 'abstract') return;
      walkChildren(el, ctx);
      break;
    case "div":
      if (el.className === 'csl-entry') {
        walkChildren(el, ctx);
      }
      else {
        out.push(`block(`);
        walkChildren(el, ctx);
        out.push(CLOSE);
      }
      break;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      out.push(`heading(level: ${n.replace(/^h/, '')}, `);
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "p":
      out.push('par(');
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "em":
    case "i":
      out.push('emph(');
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "strong":
      out.push('strong(');
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "u":
      out.push('underline(');
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "a":
      if (el.getAttribute('role') === 'doc-biblioref') out.push(`link(label("${esc(el.getAttribute('href').replace('#', ''))}"), `);
      else out.push(`link("${esc(el.getAttribute('href'))}", `);
      walkChildren(el, ctx);
      out.push(CLOSE);
      break;
    case "span":
      if (el.className === 'references') {
        out.push(`references(`);
        walkChildren(el, ctx);
        out.push(CLOSE);
      }
      else {
        console.warn(chalk.red(`Other span: ${el.className}`));
      }
      break;
    case "img":
      out.push(`figure(image("${esc(el.getAttribute('src'))}")) +`);
      break;
    case "table":
      out.push(`align(center, table(columns: ${el.querySelector('tr')?.querySelectorAll('td')?.length || 1}, `);
      walkChildren(el, ctx);
      out.push(')' + CLOSE_ITEMS);
      break;
    case "ul":
      out.push('list(');
      walkChildren(el, ctx);
      out.push(CLOSE_ITEMS);
      break;
    case "ol":
      out.push('enum(');
      walkChildren(el, ctx);
      out.push(CLOSE_ITEMS);
      break;
    case "li":
    case "td":
      out.push(`(`);
      walkChildren(el, ctx);
      out.push(CLOSE_ITEM);
      break;
    case "dl":
      out.push('terms(tight: false, ');
      walkChildren(el, ctx);
      out.push(CLOSE_ITEMS);
      break;
    case "dt":
      // WARNING: we assume that dt/dd pairs are well balanced.
      out.push(`terms.item(`);
      walkChildren(el, ctx);
      // we attach the label to a bold space, because they're markup only
      if (el.id) out.push(`[* *#label("${esc(el.id)}")]`);
      out.push(', ');
      // out.push(CLOSE);
      break;
    case "dd":
      walkChildren(el, ctx);
      out.push(CLOSE_ITEM);
      break;
    // ignore and walk
    case "head":
    case "tr":
      walkChildren(el, ctx);
      break;
    // ignore and skip
    case "meta":
    case "title":
    case "link":
    case "style":
    case "header":
      break;
    default:
      console.warn(chalk.red(`${n}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className}` : ''}`));
      walkChildren(el, ctx);
  }
}

function walkText (txt, ctx) {
  ctx.out.push(`"${esc(txt.nodeValue)}" +`);
}

function walkChildren(el, ctx) {
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === 1) walkEl(n, ctx);
    else if (n.nodeType === 3) walkText(n, ctx);
  });
}

function esc (str) {
  return (str || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function datetime (d) {
  if (d === true) d = new Date();
  if (typeof d === 'string') d = new Date(d);
  return `datetime(year: ${d.getFullYear()}, month: ${d.getMonth() + 1}, day: ${d.getDate()})`;
}
