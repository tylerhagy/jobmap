#!/usr/bin/env node
/*
 * validate.mjs — prove a jobs file is safe for jobmap to open and write.
 *
 * WHY THIS EXISTS
 * The app refuses to write a file it cannot reproduce byte-for-byte. This
 * exposes that same check as a CLI so anything GENERATING a jobs file can prove
 * the result is editable before handing it over. The agent and the app run the
 * identical function, so they can never disagree about whether a file is safe.
 *
 * Reads only. Writes nothing.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { parseDocument, verifyRoundTrip, countJobs, allJobs, lintJob } from './parser.js';

function check(path) {
  let text;
  try { text = readFileSync(path, 'utf8'); }
  catch (e) { console.log(`ERROR     ${basename(path)}  (${e.code})`); return 1; }

  const r = verifyRoundTrip(text);
  if (!r.ok) {
    console.log(`READ-ONLY ${basename(path)}`);
    if (r.error) console.log(`          parse failed: ${r.error}`);
    else {
      console.log(`          round-trip mismatch at line ${r.line}`);
      console.log(`          expected: ${JSON.stringify(r.expected)}`);
      console.log(`          produced: ${JSON.stringify(r.produced)}`);
    }
    return 1;
  }

  const doc = parseDocument(text);
  const n = countJobs(doc);
  if (!n) { console.log(`NOT A JOBS FILE ${basename(path)}  (round-trips, but holds no jobs)`); return 0; }

  const jobs = allJobs(doc);
  const groups = doc.segments.filter((s) => s.kind === 'group').length;
  const confirmed = jobs.filter((j) => j.fields.confidence === 'Confirmed').length;
  const flagged = jobs.filter((j) => lintJob(j).length).length;
  console.log(`OK        ${basename(path)}  ${n} jobs · ${groups} groups · ${confirmed} confirmed · ${flagged} flagged`);
  return 0;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log('usage: node validate.mjs <file.md> | --dir <folder>');
  process.exit(2);
}

let bad = 0;
if (args[0] === '--dir') {
  const dir = args[1] || '.';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (!files.length) { console.log(`no .md files in ${dir}`); process.exit(0); }
  for (const f of files) if (statSync(join(dir, f)).isFile()) bad += check(join(dir, f));
} else {
  for (const f of args) bad += check(f);
}
process.exit(bad ? 1 : 0);
