
import { writeFile } from "node:fs/promises";
import * as typst from "typst";
import chalk from "chalk";

export async function generateTypst (data, outTypst, outPDF) {
  const out = [];
  walkEl(data.document.documentElement, {
    out,
    theme: data.theme || { options: {} },
  });
  await writeFile(outTypst, out.join("\n"), "utf-8");
  await typst.compile(outTypst, outPDF);
}

// XXX
//  a
//  div
//  dl, dt, dd
//  em
//  i
//  header
//  h1…
//  img
//  main
//  section
//  span
//  strong
//  table, tr, td
//  ul, li, ol
function walkEl (el, ctx) {
  const { out, theme } = ctx;
  const n = el.localName;
  switch (n) {
    case "html":
      out.push("#{", 'set page(paper: "a4")');
      walkChildren(el, ctx);
      out.push("}", "");
      break;
    case "title":
      out.push(
        `set document(title: "${esc(el.textContent)}"${theme?.options?.author ? `, author: "${esc(theme.options.author)}"` : ""})`,
      );
      break;
    case "p":
      walkChildren(el, ctx);
      out.push('parbreak()');
      break;
    // ignore and walk
    case "head":
    case "body":
      walkChildren(el, ctx);
      break;
    // ignore and skip
    case "meta":
    case "link":
    case "style":
      return;
    default:
      console.warn(chalk.red(n));
      walkChildren(el, ctx);
  }
}

function walkText (txt, ctx) {
  ctx.out.push(`"${esc(txt.nodeValue)}"`);
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
