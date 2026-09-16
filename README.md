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
