
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
    { id: 'references', class: 'special-section' },
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

  output = ref.href ? df(el(`a`, { href: ref.href }, [output]), txt('. ')) : df(output, '. ');

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
      date: '2023-10-27',
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
      date: '2023-11-13',
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
      date: '2021',
    },
    'hbr-targeting': {
      title: 'Does Personalized Advertising Work as Well as Tech Companies Claim?',
      href: 'https://hbr.org/2021/12/does-personalized-advertising-work-as-well-as-tech-companies-claim',
      authors: ['Bart de Langhe', 'Stefano Puntoni'],
      date: '2021-12-16',
    },
    'internet-users': {
      title: 'Individuals using the Internet (% of population)',
      href: 'https://data.worldbank.org/indicator/it.net.user.zs?end=2022&start=1960&view=chart',
      authors: ['International Telecommunication Union (ITU) World Telecommunication/ICT Indicators Database (via The World Bank)'],
      date: '2022',
    },
    'mozilla-revenue': {
      title: 'Mozilla expects to generate more than $500M in revenue this year',
      href: 'https://techcrunch.com/2021/12/13/mozilla-expects-to-generate-more-than-500m-in-revenue-this-year/',
      authors: ['Frederic Lardinois'],
      date: '2021-12-13',
    },
    'nyt-last-night': {
      title: 'Your Apps Know Where You Were Last Night, and They’re Not Keeping It Secret',
      href: 'https://www.nytimes.com/interactive/2018/12/10/business/location-data-privacy-apps.html',
      authors: ['Jennifer Valentino De Vries, Natasha Singer, Michael H. Keller And Aaron Krolik'],
      date: '2018-12-10',
    },
    'perfect-webpage': {
      title: 'The Perfect Webpage',
      href: 'https://www.theverge.com/c/23998379/google-search-seo-algorithm-webpage-optimization',
      authors: ['Mia Sato'],
    },
    'spy-one-stop-shop': {
      title: 'U.S. Spy Agencies Are Getting a One-Stop Shop to Buy Your Most Sensitive Personal Data',
      href: 'https://theintercept.com/2025/05/22/intel-agencies-buying-data-portal-privacy/',
      authors: ['Sam Biddle'],
      date: '2025-05-22',
    },
    'wfa-ad-fraud': {
      title: 'Compendium of ad fraud knowledge for media investors',
      href: 'https://swa-asa.ch/wAssets/docs/publikationen/de/branchenempfehlungen-swa/WFACompendiumofAdFraudKnowledge.pdf',
      authors: ['World Federation of Advertisers', 'The Advertising Fraud Council'],
      date: '2016',
    },
    'where-browsers': {
      title: 'Where Browsers Come From',
      href: 'https://bkardell.com/blog/WhereBrowsersComeFrom.html',
      authors: ['Brian Kardell'],
      date: '2022-07-07',
    },
    'why-google-dominates-ads': {
      title: 'Why Google Dominates Advertising Markets',
      href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3500919',
      authors: ['Dina Srinivasan'],
      date: '2019-12-09',
    },
    'wired-nuclear-brothels': {
      title: 'Anyone Can Buy Data Tracking US Soldiers and Spies to Nuclear Vaults and Brothels in Germany',
      href: 'https://www.wired.com/story/phone-data-us-soldiers-spies-nuclear-germany/',
      authors: ['Dhruv Mehrotra', 'Dell Cameron'],
      date: '2024-11-19',
    },
  })[k];
}
