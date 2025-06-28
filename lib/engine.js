
import { join, dirname } from 'node:path';
import { createWriteStream } from 'node:fs';
import { mkdir, rm, copyFile, readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import beautify from 'js-beautify';
import { GDocSource, toHTML } from './gdocs.js';
import canRead from './can-read.js';
import makeRel from './rel.js';

const rel = makeRel(import.meta.url);

class Context {
  #currentDir;
  #configPath;
  #configure;
  #cache;
  #data;
  #execution = [];
  constructor ({ cache } = {}) {
    this.#data = {};
    this.#cache = cache;
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
      const save = opts?.save ? join(this.#currentDir, opts.save) : undefined;
      if (this.#cache && opts?.save && await canRead(save)) {
        this.#data.gdoc = JSON.parse(await readFile(save));
      }
      else {
        const g = new GDocSource();
        await g.auth(service);
        this.#data.gdoc = await g.doc(src);
        if (opts?.save) {
          await writeFile(join(this.#currentDir, opts.save), JSON.stringify(this.#data.gdoc, null, 2));
        }
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
      await theme(opts, this, this.#data);
    });
    return this;
  }

  // --- Local data
  async downloadToRel (url, relPath) {
    const fullPath = join(this.#currentDir, dirname(relPath));
    console.warn(`cache=${this.#cache} && canRead(${fullPath})=${canRead(fullPath)}`);
    if (this.#cache && await canRead(fullPath)) return;
    await mkdir(fullPath, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url} (${res.status})`);
    const w = createWriteStream(join(this.#currentDir, relPath), { flags: 'w' });
    await finished(Readable.fromWeb(res.body).pipe(w));
  }
  async cpToRel (from, to) {
    await copyFile(from, join(this.#currentDir, to));
  }
  async cleanupLocal () {
    if (this.#cache) return;
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

export async function setupAndRun (path, { watch, cache }) {
  const ctx = new Context({ cache });
  await ctx.setupPath(path);
  if (watch) await ctx.watch();
  else await ctx.run();
}
