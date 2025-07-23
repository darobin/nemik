
import htmlHelpers from "./html-helpers.js";

const inlineCitation = /((?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\]))/; // [[citation]]

export function biblioReferences (data) {
  const { document } = data;
  const { textNodes } = htmlHelpers(document);
  document.normalize();
  data.references = new Set();

  const exclusions = ["pre", "svg", "script", "style"];
  const txts = textNodes(document.body, exclusions, { wsNodes: false });

  for (const txt of txts) {
    const subtxt = txt.data.split(inlineCitation);
    if (subtxt.length === 1) continue;
    const df = document.createDocumentFragment();
    let matched = true;
    for (const t of subtxt) {
      matched = !matched;
      if (!matched) {
        df.append(t);
        continue;
      }
      df.append(...inlineBibrefMatches(t, data));
    }
    txt.replaceWith(df);
  }
}

function inlineBibrefMatches (matched, data) {
  const { document } = data;
  const { el, df } = htmlHelpers(document);
  // slices "[[" at the start and "]]" at the end
  const ref = matched.slice(2, -2);
  if (ref.startsWith("\\")) return [`[[${ref.slice(1)}]]`];
  const [spec, linkText] = ref.split("|").map(str => str.trim().replace(/\s+/g, " "));
  const key = spec.replace(/^(!|\?)/, "");
  const href = `#bib-${key.toLowerCase()}`;
  const text = linkText || key;
  const elem = el('cite', {}, [el('a', { class: 'bibref', href }, [text])]);
  const cite = linkText ? elem : df('[', elem, ']');
  data.references.add(ref);
  return cite.childNodes[1] ? cite.childNodes : [cite];
}

export function renderBiblio (data, ctx) {
  const { document } = data;
  if (!data.references || !data.references.size) return;
  const { el } = htmlHelpers(document);
  const refEls = [];
  [...data.references.values()].sort().forEach(k => {
    const v = lookup(k);
    if (!v) {
      ctx.error(`No reference found for ${k}.`);
      return;
    }
    refEls.push(el('dt', { id: `bib-${k.toLowerCase()}` }, [`[${k}]`]));
    refEls.push(el('dd', {}, [stringifyReference(v, document)]));
  });
  el(
    'section',
    { id: 'references' },
    [
      el('h1', {}, ['References']),
      el(
        'dl',
        { class: 'bibliography' },
        refEls
      )
    ],
    document.body
  );
}

function stringifyReference (ref, document) {
  if (typeof ref === "string") return ref;
  const { el, df, txt } = htmlHelpers(document);
  let output = el('cite', {}, [ref.title]);

  output = ref.href ? df(el(`a`, { href: ref.href }, [output])) : df(output, '. ');

  if (ref.authors?.length) {
    output.append(txt(ref.authors.join("; ").replace(/\.\s*$/, '')));
    if (ref.etAl) output.append(txt(" et al"));
    output.append(txt(". "));
  }
  if (ref.publisher) output.append(txt(ref.publisher.replace(/\.\s*$/, '') + '. '));
  if (ref.date) output.append(txt(`${ref.date}. `));
  if (ref.status) output.append(txt(`${ref.status}. `));
  if (ref.href) el('a', { href: ref.href }, [ref.href], output);
  return output;
}

function lookup (k) {
  return ({
    '26-billion-default': {
      title: 'Google paid a whopping $26.3 billion in 2021 to be the default search engine everywhere',
      href: 'https://www.theverge.com/2023/10/27/23934961/google-antitrust-trial-defaults-search-deal-26-3-billion',
      authors: ['David Pierce'],
    },
    amp: {
      title: 'Accelerated Mobile Pages',
      href: 'https://amp.dev/',
      authors: ['Google'],
      status: 'Proprietary Format',
    },
    'apple-36': {
      title: 'Apple Gets 36% of Google Revenue in Search Deal, Expert Says',
      href: 'https://www.bloomberg.com/news/articles/2023-11-13/apple-gets-36-of-google-revenue-from-search-deal-witness-says',
      authors: ['Leah Nylen'],
    },
    'bad-search': {
      title: 'How bad are search results?',
      href: 'https://danluu.com/seo-spam/',
      authors: ['Dan Luu'],
    },
    'fiduciary-ua': {
      title: 'The Fiduciary Duties of User Agents',
      href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3827421',
      authors: ['Robin Berjon'],
    },
    'internet-users': {
      title: 'Individuals using the Internet (% of population)',
      href: 'https://data.worldbank.org/indicator/it.net.user.zs?end=2022&start=1960&view=chart',
      authors: ['International Telecommunication Union (ITU) World Telecommunication/ICT Indicators Database (via The World Bank)'],
    },
    'mozilla-revenue': {
      title: 'Mozilla expects to generate more than $500M in revenue this year',
      href: 'https://techcrunch.com/2021/12/13/mozilla-expects-to-generate-more-than-500m-in-revenue-this-year/',
      authors: ['Frederic Lardinois'],
    },
    'perfect-webpage': {
      title: 'The Perfect Webpage',
      href: 'https://www.theverge.com/c/23998379/google-search-seo-algorithm-webpage-optimization',
      authors: ['Mia Sato'],
    },
    'where-browsers': {
      title: 'Where Browsers Come From',
      href: 'https://bkardell.com/blog/WhereBrowsersComeFrom.html',
      authors: ['Brian Kardell'],
    },
  })[k];
}
