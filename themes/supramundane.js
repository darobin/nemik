
import htmlHelpers from '../lib/html-helpers.js';

export default async function (opts, ctx) {
  const { el } = htmlHelpers(ctx.document);
  el('style', {}, ['p { color: red; }'], ctx.document.head);
}
