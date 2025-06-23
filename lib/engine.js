
import { join } from 'node:path';
import chalk from 'chalk';
import { GDocSource } from './gdocs.js';

class Context {
  #configPath;
  #configure;
  #data;
  #execution = [];
  constructor () {
    this.#data = {};
  }
  async setupPath (path) {
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
  gdoc (service, src) {
    this.#execution.push(async () => {
      const g = new GDocSource();
      await g.auth(service);
      this.#data.gdoc = await g.doc(src);
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
