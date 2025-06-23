
import { join } from 'node:path';
import chalk from 'chalk';

class Context {
  #config;
  #run;
  async setupPath (path) {
    this.#config = join(path, 'nemik.config.js');
    this.#run = (await import(this.#config)).default;
  }

  // --- Execution
  async run () {
    await this.#run(this);
  }
  async watch () {
    // XXX
    // - script specifies watch targets
    // - watch the script itself and reload when needed (if watch)
  }

  // --- Logging
  log (...str) {
    console.log.apply(console, str);
  }
  warn (...str) {
    str.unshift(chalk.bold.yellow('[WARN]'));
    console.warn.apply(console, str);
  }
  error (...str) {
    str.unshift(chalk.bold.red('[ERROR]'));
    console.error.apply(console, str);
  }
}

export async function setupAndRun (path, { watch }) {
  const ctx = new Context();
  await ctx.setupPath(path);
  if (watch) await ctx.watch();
  else await ctx.run();
}
