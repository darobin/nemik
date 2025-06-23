#!/usr/bin/env node

import { cwd } from "node:process";
import { isAbsolute, join } from "node:path";
// import { createReadStream, createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { program } from 'commander';
import { setupAndRun } from "./lib/engine.js";
import { addCredentials, generateGoogleToken } from "./lib/credentials.js";
import makeRel from './lib/rel.js';

const rel = makeRel(import.meta.url);
const { version } = JSON.parse(await readFile(rel('./package.json')));

program
  .name('nemik')
  .description('All-purpose document generation')
  .version(version)
;

// credentials management
const credentials = program.command('credentials');
credentials
  .command('set')
  .argument('<service>', 'the key for which these credentials are for')
  .argument('<account>')
  .argument('<password>')
  .action(async (service, account, password) => {
    await addCredentials(service, account, password);
  })
;
credentials
  .command('gdoc')
  .argument('<service>', 'the key for which these credentials are for')
  .argument('<clientId>', 'the Google client ID')
  .argument('<clientSecret>', 'the Google client secret')
  .action(async (service, clientId, clientSecret) => {
    await generateGoogleToken(service, clientId, clientSecret);
  })
;

// watch
program
  .command('watch')
  .action(async () => {
    await setupAndRun(cwd(), { watch: true });
  })
;

// run
program
  .command('run')
  .action(async () => {
    await setupAndRun(cwd(), { watch: false });
  })
;

program.parse();

function absolutise (path) {
  return isAbsolute(path) ? path : join(cwd(), path);
}

// function die (str) {
//   console.error(`Error: ${str}`);
//   exit(1);
// }
