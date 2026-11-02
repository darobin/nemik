# nemik

All purpose document generator.

## Google Docs setup

Store the OAuth client ID and secret once; this opens a browser to authorise nemik:

    nemik credentials gdoc gdoc-rb <clientId> <clientSecret>

After that, running a draft takes care of itself: access tokens are refreshed
silently, and if Google drops the authorisation, nemik reopens the browser to
get a new one and carries on. `nemik credentials refresh-gdoc gdoc-rb` still
exists if you ever want to force a new authorisation.

If the authorisation keeps disappearing every week, that's because the OAuth
consent screen in the Google Cloud project is in "Testing" status: Google
expires refresh tokens for those after 7 days. Switch the publishing status to
"In production" and the token stops expiring.

The Docs and Drive APIs need to be enabled once per project. If they aren't,
nemik prints the links to enable them.

## Themes and PDF output

Every theme produces its PDF through Typst (the `typst` command has to be on
the path):

```js
nemik
  .gdoc(...)
  .gdoc2html()
  .theme('book', { author: 'Robin Berjon', appendices: ['Acknowledgements'] })
  .typst('my-book.typst', 'my-book.pdf')
```

`.typst(source, pdf)` writes the generated Typst source next to the config,
which is handy when something looks off, then compiles it. The themes:

- `supramundane`: report with an optional cover image, an abstract page and a
  table of contents.
- `academic`: the same structure without the branding, Cormorant headings and
  Mulish text.
- `book`: Monticello throughout, book paragraphs (indented, no space between
  them), chapters on new pages, footnotes on the page.
- `eurosky` and `supramundane-simple`: two-column memo with a brand band on
  the first page and a brand footer on the others.

Theme options, all optional: `author`, `date` (`true` for today, or a string),
`appendices` (titles of the top-level sections to set compactly, after the
body), `cover` (an image path, for supramundane, academic and book),
`noAbstract` (keep whatever precedes the first heading in the body instead of
on an abstract page).

Themes copy their fonts to `.nemik/fonts/` for the HTML; the static ones
(Monticello) are also handed to Typst. Typst can't use variable fonts, so
Mulish, Cormorant, Catamaran and Josefin Sans have to be installed on the
system as static instances (the `static` folder of a Google Fonts download);
with only a variable font installed, Typst renders every weight the same.

`.pdf(file)` is the older WeasyPrint path. It still works, using the themes'
CSS, but nothing needs it any more.

## Zotero citations

Documents cited through the Zotero plugin for Google Docs get their
bibliography from `.zotero()`, which runs after the document is fetched and
converted:

```js
nemik
  .gdoc(...)
  .gdoc2html()
  .zotero()
  .theme('book', { ... })
```

Citations stay as Zotero rendered them: prefixes ("cited in"), locators and
suffixes are kept around the linked key ("Slobodian 2020"), and a citation
with the author suppressed links just the year. Each cited work is
identified by its Zotero URI, so a work keeps a single bibliography entry
however many times, and from however many machines, it was cited. The
bibliography is set in Chicago author-date; works that share an author and
year get `a`, `b`, … letters in the text and in the list. A `PROBLEM:` line
during a run means a citation could not be read the way Zotero rendered it,
or that the same item carries a different author or year in different
citations (refresh the citations in Zotero, then run again).

## NaNoWriMo tracker

Add `.nanowrimo()` after the HTML conversion to track a daily writing goal:

```js
nemik
  .gdoc(...)
  .gdoc2html()
  .nanowrimo({ start: '2026-11-01', perDay: 2000 })
```

Every run records the document's word count for the day in `nanowrimo.json`
(next to `nemik.config.js`) and prints where you stand against the goal:
words written since the start, ahead or behind, today's words, average pace,
the pace needed to finish, and a spark per day.

Options, all optional: `start` (defaults to November 1 of the current year),
`days` (30), `perDay` (2000), `baseline` (the word count the goal starts from;
by default the count from the last run before the start date, or the first run
if that is already in the window), `file` (`nanowrimo.json`), and `today` (a
`YYYY-MM-DD` override, mostly for testing). Run it at least once before the
start date so the baseline is captured from the live document.
