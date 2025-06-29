
import { join, dirname } from 'node:path';
import { createWriteStream } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import beautify from 'js-beautify';
import { GDocSource, toHTML } from './gdocs.js';
import makeRel from './rel.js';

const rel = makeRel(import.meta.url);

class Context {
  #currentDir;
  #configPath;
  #configure;
  #data;
  #execution = [];
  constructor () {
    this.#data = {};
  }
  async setupPath (path) {
    this.#currentDir = path;
    this.#configPath = join(path, 'nemik.config.js');
    this.#configure = (await import(this.#configPath)).default;
  }

  // --- Execution
  async run () {
    await this.#configure(this);
    await this.cleanupLocal();
    while (this.#execution.length) {
      await this.#execution.shift()();
    }
  }
  async watch () {
    // XXX
    // - script specifies watch targets
    // - watch the script itself and reload when needed (if watch)
  }

  // --- Google Docs
  gdoc (service, src, opts) {
    this.#execution.push(async () => {
      const g = new GDocSource();
      await g.auth(service);
      this.#data.gdoc = await g.doc(src);
      if (opts?.save) {
        await writeFile(join(this.#currentDir, opts.save), JSON.stringify(this.#data.gdoc, null, 2));
      }
    });
    return this;
  }
  gdoc2html () {
    this.#execution.push(async () => {
      if (!this.#data.gdoc) throw new Error(`Need to fetch a gdoc before turning it into HTML.`);
      this.#data.dom = await toHTML(this.#data.gdoc, this);
      this.#data.document = this.#data.dom.window.document;
    });
    return this;
  }

  // --- themes & style
  theme (name, opts) {
    this.#execution.push(async () => {
      const theme = (await import(rel(`../themes/${name}.js`))).default;
      await theme(opts, this.#data);
    });
    return this;
  }

  // --- Local data
  async downloadToRel (url, rel) {
    await mkdir(join(this.#currentDir, dirname(rel)), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url} (${res.status})`);
    const w = createWriteStream(join(this.#currentDir, rel), { flags: 'w' });
    await finished(Readable.fromWeb(res.body).pipe(w));
  }
  async cleanupLocal () {
    await rm(join(this.#currentDir, '.nemik'), { recursive: true, force: true });
  }
  saveHTML (opts) {
    this.#execution.push(async () => {
      if (opts?.to) {
        let html = this.#data.dom.serialize();
        if (opts.pretty) html = beautify.html(html);
        await writeFile(join(this.#currentDir, opts.to), html);
      }
    });
    return this;
  }

  // --- Debugging
  data (key, cb) {
    this.#execution.push(async () => {
      cb(this.#data[key]);
    });
    return this;
  }

  // --- Logging
  log (...str) {
    this.#execution.push(async () => {
      console.log.apply(console, str);
    });
    return this;
  }
  warn (...str) {
    this.#execution.push(async () => {
      str.unshift(chalk.bold.yellow('[WARN]'));
      console.warn.apply(console, str);
    });
    return this;
  }
  error (...str) {
    this.#execution.push(async () => {
      str.unshift(chalk.bold.red('[ERROR]'));
      console.error.apply(console, str);
    });
    return this;
  }
}

export async function setupAndRun (path, { watch }) {
  const ctx = new Context();
  await ctx.setupPath(path);
  if (watch) await ctx.watch();
  else await ctx.run();
}
