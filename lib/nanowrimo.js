
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import canRead from './can-read.js';

const DAY = 24 * 60 * 60 * 1000;
const BAR_WIDTH = 60;
const SPARKS = ' ▁▂▃▄▅▆▇█';

export function countWords (document) {
  return document.body.textContent.split(/\s+/).filter(Boolean).length;
}

// Tracks words written against a daily goal (NaNoWriMo-style) and prints a report.
// State lives in a JSON file next to nemik.config.js so that progress survives runs.
export async function nanowrimo (data, dir, opts = {}) {
  if (!data.document) throw new Error(`Need to have the HTML conversion to count words.`);
  const now = opts.today ? parseDate(opts.today) : new Date();
  const today = isoDate(now);
  const {
    start = `${now.getFullYear()}-11-01`,
    days = 30,
    perDay = 2000,
    file = 'nanowrimo.json',
  } = opts;
  const statePath = join(dir, file);
  const state = (await canRead(statePath))
    ? JSON.parse(await readFile(statePath, 'utf-8'))
    : { start, days, perDay, counts: {} };
  state.counts ||= {};

  const words = countWords(data.document);
  const dayIndex = daysBetween(start, today) + 1; // 1-based, day 1 is the start date
  let warning;
  if (opts.baseline != null) state.baseline = opts.baseline;
  else if (dayIndex < 1) state.baseline = words; // not started: the latest count before the start is the baseline
  else if (state.baseline == null) {
    state.baseline = words;
    if (dayIndex > 1) {
      warning = `Baseline set on day ${dayIndex}: words written before this run don't count. Set the baseline option (or edit ${file}) to fix that.`;
    }
  }
  if (dayIndex >= 1) state.counts[today] = words;
  await writeFile(statePath, JSON.stringify(state, null, 2));

  const report = render({ state, start, days, perDay, today, dayIndex, words });
  console.log(report);
  if (warning) console.warn(chalk.bold.yellow('[WARN]'), warning);
  return report;
}

function render ({ state, start, days, perDay, today, dayIndex, words }) {
  const tag = chalk.bold('NaNoWriMo ');
  const target = perDay * days;
  const { baseline } = state;
  if (dayIndex < 1) {
    const dayWord = -dayIndex + 1 === 1 ? 'day' : 'days';
    return `${tag} starts in ${1 - dayIndex} ${dayWord} · baseline ${fmt(baseline)} words · goal ${fmt(target)} (${fmt(perDay)}/day over ${days} days)`;
  }

  const day = Math.min(dayIndex, days);
  const finished = dayIndex > days;
  const written = words - baseline;
  const expected = perDay * day;
  const diff = written - expected;
  const pct = Math.max(0, Math.min(100, Math.round((written / target) * 100)));
  const daily = dailySeries({ state, start, baseline, day, today });

  // headline
  let status;
  if (written >= target) status = chalk.green(`goal reached ${fmt(signed(written - target))}`);
  else if (diff > 0) status = chalk.green(`${fmt(diff)} ahead`);
  else if (diff < 0) status = chalk.yellow(`${fmt(-diff)} behind`);
  else status = chalk.green('on target');
  const when = finished ? 'finished' : `day ${day}/${days}`;
  const lines = [`${tag} ${when} · ${fmt(written)} written · ${status} (target ${fmt(written >= target ? target : expected)})`];

  // progress bar with a marker at where we ought to be
  const fill = Math.max(0, Math.min(BAR_WIDTH, Math.round((written / target) * BAR_WIDTH)));
  const marker = Math.min(BAR_WIDTH, Math.round((expected / target) * BAR_WIDTH));
  const colour = diff < 0 ? chalk.yellow : chalk.green;
  const cells = [...Array(BAR_WIDTH)].map((_, i) => (i < fill ? colour('▓') : chalk.dim('░')));
  if (!finished && marker < BAR_WIDTH) cells[marker] = chalk.bold.white('│');
  lines.push(`${cells.join('')} ${pct}% of ${fmt(target)}`);

  // pace
  const pace = [];
  if (!finished) {
    const last = daily.at(-1);
    if (last) {
      pace.push(last.span === 1
        ? `today ${fmt(signed(last.words))}`
        : `${fmt(signed(last.words * last.span))} since ${last.from} (${last.span} days)`);
    }
  }
  pace.push(`avg ${fmt(Math.round(written / day))}/day`);
  const remaining = days - day;
  if (!finished && remaining > 0 && written < target) {
    pace.push(`need ${fmt(Math.ceil((target - written) / remaining))}/day over the remaining ${remaining} ${remaining === 1 ? 'day' : 'days'}`);
  }
  lines.push(pace.join(' · '));

  // one spark per day, full height is a day's goal
  const sparks = daily.map(({ words: w }) => {
    const level = Math.max(0, Math.min(8, Math.round((w / perDay) * 8)));
    const ch = SPARKS[level];
    if (w >= perDay) return chalk.green(ch);
    if (w <= 0) return chalk.red('▁');
    return chalk.yellow(ch);
  });
  lines.push(`${sparks.join('')}  ${chalk.dim(`(full bar = ${fmt(perDay)} words/day)`)}`);
  return lines.join('\n');
}

// Words per day for days 1..day. Runs don't happen every day, so a gap between two
// recorded counts is spread evenly over the days it covers.
function dailySeries ({ state, start, baseline, day, today }) {
  const first = addDays(start, -1);
  const records = Object.entries(state.counts)
    .filter(([d]) => d >= start && d <= today)
    .sort(([a], [b]) => (a < b ? -1 : 1));
  const series = [];
  let prevDate = first;
  let prevCount = baseline;
  for (const [date, count] of records) {
    const span = daysBetween(prevDate, date);
    if (span < 1) continue;
    const perDay = (count - prevCount) / span;
    for (let i = 0; i < span; i++) series.push({ words: perDay, span, from: prevDate });
    prevDate = date;
    prevCount = count;
  }
  return series.slice(0, day);
}

// local dates as YYYY-MM-DD
function isoDate (d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseDate (str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween (a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / DAY);
}
function addDays (str, n) {
  const d = parseDate(str);
  d.setDate(d.getDate() + n);
  return isoDate(d);
}
function fmt (n) {
  if (typeof n === 'string') return n;
  return Math.round(n).toLocaleString('en-US');
}
function signed (n) {
  return `${n < 0 ? '−' : '+'}${fmt(Math.abs(n))}`;
}
