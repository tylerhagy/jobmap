#!/usr/bin/env node
/*
 * test.mjs — the gate on everything else.
 *
 * The parser is what stands between the app and Coleman's real jobs document.
 * If this does not pass, do not use the app to write.
 */
import { readFileSync } from 'fs';
import {
  parseDocument, serializeDocument, verifyRoundTrip, countJobs, allJobs,
  parseStatement, renderStatement, splitRow, cellSafe, lintJob, touch, blankJobsFile, removeJob, roles, unroled,
  groupsOf, renameGroup, moveGroup, moveJob, removeGroup, unassignedGroup, splitDeps, joinDeps,
  parseFrequency, renderFrequency,
} from './parser.js';

let pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; return; }
  fail++;
  console.log(`  FAIL ${name}${detail ? '\n       ' + detail : ''}`);
}
function eq(name, a, b) { ok(name, a === b, `expected ${JSON.stringify(b)}\n       got      ${JSON.stringify(a)}`); }

const REAL = readFileSync(new URL('./fixtures/real-jobs.md', import.meta.url), 'utf8');
const OLD_FORMAT = readFileSync(new URL('./fixtures/old-format-retired-fields.md', import.meta.url), 'utf8');

// ---- round-trip, the load-bearing property
{
  const r = verifyRoundTrip(REAL);
  ok('real file round-trips byte-for-byte', r.ok, r.ok ? '' : `line ${r.line}: ${JSON.stringify(r.expected)} vs ${JSON.stringify(r.produced)}`);
  const doc = parseDocument(REAL);
  eq('real file job count', countJobs(doc), 51);
  eq('real file group count', doc.segments.filter((s) => s.kind === 'group').length, 10);
  ok('trailing non-job section kept as raw', doc.segments.some((s) => s.kind === 'raw' && s.src.some((l) => /How this document stays current/.test(l))));
}

// ---- idempotency
{
  const once = serializeDocument(parseDocument(REAL));
  const twice = serializeDocument(parseDocument(once));
  eq('serialize is idempotent', twice, once);
}

// ---- a clean parse must never reflow anything
{
  const doc = parseDocument(REAL);
  const out = serializeDocument(doc);
  eq('untouched document is unchanged', out, REAL);
}

// ---- one edit, one line
{
  // First edit inserts the field table (a structural addition, +4 lines).
  const doc = parseDocument(REAL);
  const j = allJobs(doc).find((x) => x.title.startsWith('Correct an error'));
  ok('found the target job', !!j);
  j.fields.stage = 'Modify';
  touch(j, 'fields');
  const once = serializeDocument(doc);
  eq('inserting a field table adds exactly 4 lines', once.split('\n').length - REAL.split('\n').length, 4);
  ok('an untouched statement is preserved verbatim',
    once.includes('> When something was paid wrong, I need to put it right on a future payment rather'));
  ok('edited output round-trips', verifyRoundTrip(once).ok);

  // Second edit, table now present, must be exactly one line.
  const doc2 = parseDocument(once);
  const j2 = allJobs(doc2).find((x) => x.title.startsWith('Correct an error'));
  j2.fields.who = 'Priya Castellan';
  touch(j2, 'fields');
  const twice = serializeDocument(doc2);
  const a = once.split('\n'), b = twice.split('\n');
  let changed = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) changed++;
  eq('a field edit on an existing table changes exactly one line', changed, 1);
  ok('twice-edited output round-trips', verifyRoundTrip(twice).ok);
}

// ---- editing one job leaves every other job byte-identical
{
  const doc = parseDocument(REAL);
  const jobs = allJobs(doc);
  jobs[0].fields.stage = 'Define';
  touch(jobs[0], 'fields');
  const out = serializeDocument(doc);
  const after = allJobs(parseDocument(out));
  let same = 0;
  for (let i = 1; i < jobs.length; i++) if (after[i].src.join('\n') === jobs[i].src.join('\n')) same++;
  eq('other jobs untouched', same, jobs.length - 1);
}

// ---- statement grammar
{
  const st = parseStatement('When a file is late, I need to know early, so that payment is not missed.');
  eq('statement when', st.when, 'a file is late');
  eq('statement need', st.need, 'to know early');
  eq('statement outcome', st.so, 'payment is not missed');
  ok('well-formed statement is not malformed', !st.malformed);
  eq('statement renders back', renderStatement(st), 'When a file is late, I need to know early, so that payment is not missed.');

  const bad = parseStatement('When X, I need Y, and I need Z.');
  ok('a statement with no outcome is malformed', bad.malformed);
  eq('a malformed statement is kept verbatim', renderStatement(bad), 'When X, I need Y, and I need Z.');
}

// ---- the real file's one genuinely malformed statement
{
  const jobs = allJobs(parseDocument(REAL));
  const mal = jobs.filter((j) => j.statement.malformed);
  eq('exactly one real statement is malformed', mal.length, 1);
  ok('it is the two-need meter job', mal[0].title.startsWith('Stop paying on a meter'));
}

// ---- lint: flags real problems, not ordinary business language
{
  const jobs = allJobs(parseDocument(REAL));
  const flagged = jobs.filter((j) => lintJob(j).length);
  eq('lint flags only the malformed statement on the real file', flagged.length, 1);

  const fake = parseStatement('When I need numbers, I need a dashboard screen with a button, so that I can see them.');
  const issues = lintJob({ statement: fake, fields: {} });
  ok('lint catches a smuggled solution', issues.some((i) => i.kind === 'smuggled-solution'));

  // These are ordinary words in this domain and must not be flagged.
  for (const s of ['When paid, I need it in a form I can reconcile, so that accounts agree.',
    'When I report our position, I need our own data, so that I am not dependent on outsiders.',
    'When a meter in the field fails, I need to know, so that volumes are right.']) {
    const iss = lintJob({ statement: parseStatement(s), fields: {} });
    ok(`lint leaves ordinary language alone: ${s.slice(0, 34)}...`, !iss.some((i) => i.kind === 'smuggled-solution'));
  }
}

// ---- delete a job
{
  const doc = parseDocument(REAL);
  const before = allJobs(doc);
  const victim = before[1];
  const others = before.filter((j) => j !== victim).map((j) => j.src.join('\n'));
  const r = removeJob(doc, victim);
  ok('removeJob reports success', r.ok === true);
  const out = serializeDocument(doc);
  ok('the deleted job is gone', !out.includes('### ' + victim.title));
  ok('output round-trips', verifyRoundTrip(out).ok);
  const after = allJobs(parseDocument(out));
  eq('one fewer job', after.length, before.length - 1);
  let same = 0;
  for (const j of after) if (others.includes(j.src.join('\n'))) same++;
  eq('every surviving job is byte-identical', same, before.length - 1);
}

// ---- deleting a parent clears the Parent on its steps
{
  const doc = parseDocument(REAL);
  const list = allJobs(doc);
  const parent = list[0], step = list[1];
  step.fields.parent = parent.title;
  touch(step, 'fields');
  const r = removeJob(doc, parent);
  eq('the orphaned step is reported', r.orphans, 1);
  eq('and its Parent is cleared', step.fields.parent, '');
  ok('output still round-trips', verifyRoundTrip(serializeDocument(doc)).ok);
}

// ---- sign-off
{
  const jobs = allJobs(parseDocument(REAL));
  eq('nothing in the real file is signed off',
    jobs.filter((j) => j.fields.signoff).length, 0);
}

// ---- who, and the retired confidence columns
{
  const doc = parseDocument(REAL);
  const j = allJobs(doc)[0];
  j.fields.who = 'Payments team';
  j.fields.signoff = 'signed 2026-09-01';
  touch(j, 'fields');
  const out = serializeDocument(doc);
  ok('who and sign-off are written', out.includes('| Payments team |') && out.includes('signed 2026-09-01'));
  ok('the rewritten table carries the new columns',
    out.includes('| Who | Depends on | Frequency | Duration | Sign-off |'));
  ok('output round-trips', verifyRoundTrip(out).ok);
  const back = allJobs(parseDocument(out))[0];
  eq('who reads back', back.fields.who, 'Payments team');
  eq('sign-off reads back', back.fields.signoff, 'signed 2026-09-01');
}

// ---- table cell safety
{
  eq('escaped pipes survive a round of splitting', splitRow('| a \\| b | c |')[0], 'a | b');
  eq('cellSafe escapes a pipe', cellSafe('a|b'), 'a\\|b');
  eq('cellSafe flattens newlines', cellSafe('a\nb'), 'a b');
  eq('cellSafe on empty', cellSafe(undefined), '');
}

// ---- degenerate inputs must not throw
{
  for (const [name, text] of [['empty', ''], ['title only', '# Jobs\n'], ['no headings', 'just prose\n'],
    ['group with no jobs', '# T\n\n## Group\n\nprose\n'], ['job with no statement', '# T\n\n## G\n\n### A job\n\nToday: nothing.\n']]) {
    let threw = null;
    try { const d = parseDocument(text); serializeDocument(d); } catch (e) { threw = e.message; }
    ok(`does not throw on ${name}`, !threw, threw);
    ok(`${name} round-trips`, verifyRoundTrip(text).ok);
  }
}

// ---- blank file is valid and openable
{
  const b = blankJobsFile('Ops Toolkit');
  ok('a blank file round-trips', verifyRoundTrip(b).ok);
  eq('a blank file has one job', countJobs(parseDocument(b)), 1);
}

// ---- dependencies replace the parent relationship
{
  const doc = parseDocument(REAL);
  const list = allJobs(doc);
  const j = list[0];
  j.fields.depends = joinDeps([list[1].title, list[2].title]);
  touch(j, 'fields');
  const out = serializeDocument(doc);
  ok('the new columns are written',
    out.includes('| Who | Depends on | Frequency | Duration | Sign-off |'));
  ok('output round-trips', verifyRoundTrip(out).ok);
  const back = allJobs(parseDocument(out))[0];
  eq('two dependencies read back', splitDeps(back.fields.depends).length, 2);
  eq('and keep their commas', splitDeps(back.fields.depends)[0], list[1].title);
}

// ---- how often has a shape, and still writes a sentence
{
  const cases = [
    'every week', 'every 2 weeks', 'every month', 'every 3 quarters', 'every day',
    '1st Monday of the month', '3rd Thursday of the month', 'last Friday of the month',
    'on the 5th of the month', 'on the 5th and 25th of the month',
    'on the 1st, 15th and 31st of the month', 'on 2026-10-18'
  ];
  let round = 0;
  for (const c of cases) if (renderFrequency(parseFrequency(c)) === c) round++;
  eq('every shape round-trips through the editor', round, cases.length);

  eq('a plain count reads back', parseFrequency('every 2 weeks').n, 2);
  eq('and its unit', parseFrequency('every 2 weeks').unit, 'week');
  eq('a bare unit means one', parseFrequency('every month').n, 1);
  eq('an nth weekday reads back', parseFrequency('3rd Thursday of the month').weekday, 'Thursday');
  eq('set days read back', parseFrequency('on the 5th and 25th of the month').days.join(','), '5,25');
  eq('a date reads back', parseFrequency('on 2026-10-18').date, '2026-10-18');

  // Anything that is not a schedule stays exactly as written — most of these
  // jobs fire on an event, and a calendar would be a false answer.
  const odd = 'whenever a gatherer sends a new layout';
  eq('free text is kept as irregular', parseFrequency(odd).kind, 'irregular');
  eq('and comes back verbatim', renderFrequency(parseFrequency(odd)), odd);
  eq('blank stays blank', renderFrequency(parseFrequency('')), '');
  eq('a nonsense day number is dropped', renderFrequency({ kind: 'days', days: [0, 45] }), '');
}

// ---- roles
{
  const doc = parseDocument(REAL);
  const list = allJobs(doc);
  eq('no roles yet', roles(doc).length, 0);
  eq('every job is unroled', unroled(doc).length, list.length);
  list[0].fields.who = 'Payments';
  list[1].fields.who = 'Payments';
  list[2].fields.who = 'Contracting';
  const r = roles(doc);
  eq('two distinct roles', r.length, 2);
  eq('busiest role first', r[0].name, 'Payments');
  eq('with both its jobs', r[0].jobs.length, 2);
  eq('the rest are unroled', unroled(doc).length, list.length - 3);
}

// ---- categories: rename, reorder, move a job, delete both ways
{
  const doc = parseDocument(REAL);
  const gs = groupsOf(doc);
  const first = gs[0].name;
  ok('rename works', renameGroup(doc, gs[0], 'Payments team'));
  ok('and rewrites the heading', serializeDocument(doc).includes('## Payments team'));
  ok('renaming to the same name is a no-op', !renameGroup(doc, gs[0], 'Payments team'));
  ok('reorder moves it down', moveGroup(doc, gs[0], 1));
  eq('so it is second now', groupsOf(doc)[1].name, 'Payments team');
  ok('and cannot move past the end', !moveGroup(doc, groupsOf(doc)[groupsOf(doc).length - 1], 1));
  ok('output round-trips after reordering', verifyRoundTrip(serializeDocument(doc)).ok);
}
{
  const doc = parseDocument(REAL);
  const gs = groupsOf(doc);
  const job = gs[0].jobs[0];
  ok('a job moves between categories', moveJob(doc, job, gs[1]));
  ok('it left the old one', !gs[0].jobs.includes(job));
  ok('and joined the new one', gs[1].jobs.includes(job));
  ok('output round-trips', verifyRoundTrip(serializeDocument(doc)).ok);
}
{
  const doc = parseDocument(REAL);
  const g = groupsOf(doc)[0];
  const held = g.jobs.length;
  const total = allJobs(doc).length;
  const r = removeGroup(doc, g, 'keep');
  eq('every job was kept', r.moved, held);
  eq('none were lost', allJobs(doc).length, total);
  ok('they are in the drawer', unassignedGroup(doc).jobs.length >= held);
  ok('output round-trips', verifyRoundTrip(serializeDocument(doc)).ok);
}
{
  const doc = parseDocument(REAL);
  const g = groupsOf(doc)[0];
  const held = g.jobs.length;
  const total = allJobs(doc).length;
  const r = removeGroup(doc, g, 'jobs');
  eq('the jobs went with it', r.deleted, held);
  eq('and are gone from the file', allJobs(doc).length, total - held);
  ok('output round-trips', verifyRoundTrip(serializeDocument(doc)).ok);
}
// ---- the permanent-delete path (the third `ask()` button, `doDeleteGroup`'s
// 'alt' branch): the group and everyone in it must actually leave the saved file.
{
  const doc = parseDocument(REAL);
  const g = groupsOf(doc)[0];
  const name = g.name;
  const titles = g.jobs.map((j) => j.title);
  ok('the category being deleted has jobs, or this test proves nothing', titles.length > 0);
  removeGroup(doc, g, 'jobs');
  const saved = serializeDocument(doc);
  ok('the deleted category heading is gone from the saved file', !saved.includes(`## ${name}`));
  for (const title of titles) {
    ok(`the deleted job "${title}" is gone from the saved file`, !saved.includes(`### ${title}`));
  }
  ok('nobody was moved to Unassigned instead', unassignedGroup(doc).jobs.length === 0);
}

// ---- old files with the retired Stage / Confidence / Confirmed by / Parent
// columns still open, per the README's "Old files still open either way".
{
  const r = verifyRoundTrip(OLD_FORMAT);
  ok('old-format file with retired columns round-trips byte-for-byte', r.ok,
    r.ok ? '' : `line ${r.line}: ${JSON.stringify(r.expected)} vs ${JSON.stringify(r.produced)}`);

  const doc = parseDocument(OLD_FORMAT);
  eq('old-format file job count', countJobs(doc), 2);

  const jobs = allJobs(doc);
  const confirmed = jobs.find((j) => j.title.startsWith('Correct an error'));
  ok('its retired field table is still recognised', confirmed.hasFieldTable);
  eq('Confidence still reads back', confirmed.fields.confidence, 'Confirmed');
  eq('Confirmed by still reads back', confirmed.fields.confirmedBy, 'Priya Castellan');
  eq('Who still reads back alongside the retired columns', confirmed.fields.who, 'Payments team');

  const described = jobs.find((j) => j.title.startsWith('Reconcile the ledger'));
  eq('a Described job reads back too', described.fields.confidence, 'Described');

  const untouched = serializeDocument(doc);
  eq('an unedited parse of the old format is byte-identical', untouched, OLD_FORMAT);

  // Editing one job on an old-format file must still round-trip: the retired
  // Stage/Parent/Confidence/Confirmed-by columns fall away in favour of the
  // current Who/Depends on/Frequency/Duration/Sign-off table, and the other
  // job's retired-format table is left completely untouched.
  confirmed.fields.signoff = 'signed 2026-09-03';
  touch(confirmed, 'fields');
  const out = serializeDocument(doc);
  ok('editing an old-format job round-trips', verifyRoundTrip(out).ok);
  ok('the edited job now carries the current field table',
    out.includes('| Who | Depends on | Frequency | Duration | Sign-off |'));
  ok('the untouched old-format job keeps its retired columns verbatim',
    out.includes('| Stage | Who | Confidence | Confirmed by | Parent |'));
  const after = allJobs(parseDocument(out));
  eq('sign-off reads back after the edit',
    after.find((j) => j.title.startsWith('Correct an error')).fields.signoff, 'signed 2026-09-03');
  eq('the untouched job is still Described',
    after.find((j) => j.title.startsWith('Reconcile the ledger')).fields.confidence, 'Described');
}

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
