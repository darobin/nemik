
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import { GDocSource, toHTML } from './gdocs.js';

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
  gdoc2html (opts) {
    this.#execution.push(async () => {
      if (!this.#data.gdoc) throw new Error(`Need to fetch a gdoc before turning it into HTML.`);
      this.#data.dom = toHTML(this.#data.gdoc);
      this.#data.document = this.#data.dom.window.document;
      if (opts?.save) {
        await writeFile(join(this.#currentDir, opts.save), this.#data.dom.serialize());
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
