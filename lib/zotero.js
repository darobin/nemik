
// import { getCredentials } from './credentials.js';

const URL_PATTERN = /^https:\/\/www\.zotero\.org\/google-docs\/\?/;

export class Zotero {
  // #account;
  // #token;
  // #uid;
  // #library;
  #gdoc;
  #doc;
  constructor (data) {
    // this.#account = account;
    this.#gdoc = data.gdoc;
    this.#doc = data.doc;
  }
  extractBibliography () {
    const refIDs = new Set();
    const biblioData = {};
    JSON.stringify(this.#gdoc, (k, v) => {
      // In Zotero, references are links that have an ID at the end.
      // "url": "https://www.zotero.org/google-docs/?P6eILY"
      if (k === 'url' && typeof v === 'string' && URL_PATTERN.test(v)) {
        refIDs.add(v.replace(URL_PATTERN, ''));
      }
      if (k === 'namedRanges' && typeof v === 'object' && !Array.isArray(v)) {
        const assemble = {};
        Object.keys(v).forEach(key => {
          const [, id, num] = key.match(/^Z_F(.{6})(\d{3})/) || [];
          if (!assemble[id]) assemble[id] = {};
          assemble[id][num] = v[key].name;
        });
        Object.keys(assemble).forEach(id => {
          biblioData[id] = JSON.parse(Object.keys(assemble[id]).sort().map(num => assemble[id][num]).join(''));
        });
      }
    });
    // XXX
    // - at this point we should have all the data we need
    // - we can generate a bibliography from biblioData and append it as a section
    // - we can find all the zotero links in the body, create links (but we can see later maybe)
  }
  insertBibliography () {}
  // async auth () {
  //   this.#token = (await getCredentials('zotero-api-key', this.#account))?.[0]?.password;
  //   if (!this.#token) throw new Error(`No account API Nkey matching "${this.#account}"`);
  //   this.#uid = (await getCredentials('zotero-user-id', this.#account))?.[0]?.password;
  //   if (!this.#token) throw new Error(`No account user ID matching "${this.#account}"`);
  //   this.#library = zotero(this.#token).library(this.#uid);
  // }
  // XXX use the token to access the API
}


// https://www.zotero.org/google-docs/?P6eILY
