#!/usr/bin/env node
/*
 * migrate.mjs — one-shot conversion of a hand-written jobs file into the shape
 * jobmap edits.
 *
 * WHY THIS IS A SEPARATE SCRIPT
 * It is the only wholesale rewrite that ever happens. Everything the app does
 * after this is a one-line diff. Schema change is a deliberate, auditable act,
 * not something the app does behind your back on open.
 *
 * SAFETY
 * - Refuses to run unless the SOURCE round-trips first.
 * - Writes to a DESTINATION path. The source is never modified.
 * - Verifies its own output round-trips before writing it.
 *
 * What it changes, and nothing else:
 *   1. Adds a field table under every job's statement.
 *   2. Seeds Confidence from the trailing provenance line, where one says so.
 *      Stage, Parent, Confirmed by, Frequency and Duration are left BLANK —
 *      blank means nobody has been asked, and nothing arrives pre-filled.
 *   3. Wraps each group's hand-written scan table in generated markers so the
 *      app can keep it in step instead of you maintaining it twice.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
  parseDocument, serializeDocument, verifyRoundTrip, allJobs, countJobs,
  findScanTable, renderScanBlock, touch
} from './parser.js';

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.log('usage: node migrate.mjs <source.md> <destination.md>');
  process.exit(2);
}
if (existsSync(dest)) { console.log(`refusing to overwrite ${dest}`); process.exit(1); }

const text = readFileSync(src, 'utf8');

const pre = verifyRoundTrip(text);
if (!pre.ok) {
  console.log('refusing to migrate: the source does not round-trip.');
  console.log(`  line ${pre.line}`);
  console.log(`  expected: ${JSON.stringify(pre.expected)}`);
  console.log(`  produced: ${JSON.stringify(pre.produced)}`);
  process.exit(1);
}

const doc = parseDocument(text);
let tables = 0, seeded = 0, scans = 0;

for (const job of allJobs(doc)) {
  if (!job.hasFieldTable) {
    if (job.confidenceInferred && job.fields.confidence) seeded++;
    touch(job, 'fields');
    tables++;
  }
}

for (const seg of doc.segments) {
  if (seg.kind !== 'group') continue;
  const range = findScanTable(seg.introSrc);
  if (!range) continue;
  seg.introSrc = [...seg.introSrc.slice(0, range[0]), ...renderScanBlock(seg), ...seg.introSrc.slice(range[1])];
  seg.dirty = true;
  scans++;
}

const out = serializeDocument(doc);

const post = verifyRoundTrip(out);
if (!post.ok) {
  console.log('refusing to write: the migrated output does not round-trip.');
  console.log(`  line ${post.line}`);
  process.exit(1);
}

writeFileSync(dest, out);

console.log(`migrated ${countJobs(doc)} jobs`);
console.log(`  field tables added   ${tables}`);
console.log(`  confidence seeded    ${seeded}  (from the provenance line)`);
console.log(`  scan tables adopted  ${scans}`);
console.log(`  source unchanged     ${src}`);
console.log(`  written              ${dest}`);
