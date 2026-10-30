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
