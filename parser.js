/*
 * jobmap parser — jobs-to-be-done markdown, parsed and serialized.
 *
 * WHY THIS EXISTS
 * The markdown file is the source of truth, not this parser. The app must never
 * reformat a byte the user did not edit, because the same file is read and
 * edited in Obsidian. So the parser does NOT own the file — it owns addressed
 * spans inside it. Every segment keeps the exact source lines it came from plus
 * a `dirty` flag. Clean segments are emitted verbatim; only a segment someone
 * actually edited is regenerated from its fields.
 *
 * CONSEQUENCE: a one-field edit produces a one-line diff, and an untouched file
 * round-trips byte-for-byte. That round-trip is the gate the app opens on.
 *
 * No DOM, no I/O. Imported by the browser and by Node (tests, validate, migrate).
 */

/* Stage and Parent were retired on 2026-09-02 along with the job-map view they
   existed to feed. A parent said "this job is a step inside that one", which is
   the wrong relationship to model: what people actually say is "I can't do this
   until that has happened". That is DEPENDS ON, it can point at several jobs,
   and it implies no hierarchy. Both columns are still read, so a file written
   before then still opens and round-trips. */
export const UNASSIGNED = 'Unassigned';

/* ---------------------------------------------------------------- frequency
 *
 * How often gets a shape, because "every 2 weeks", "the 3rd Thursday" and "the
 * 5th and the 25th" are different kinds of answer and a text box turns them all
 * into prose nobody can group by later.
 *
 * What is STORED is still the sentence — `every 2 weeks`, `3rd Thursday of the
 * month` — so the markdown stays a thing you can read in Obsidian. The parser
 * reads that sentence back into parts for the editor.
 *
 * Crucially there is an `irregular` kind, kept verbatim. A great many of these
 * jobs are event-driven, not scheduled: "when a gatherer changes its layout" is
 * an honest answer and forcing it into a calendar would be a false one.
 */
export const FREQ_UNITS = ['day', 'week', 'month', 'quarter', 'year'];
export const FREQ_ORDINALS = ['1st', '2nd', '3rd', '4th', 'last'];
export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ORD = (d) => {
  const v = Number(d);
  if (v % 100 >= 11 && v % 100 <= 13) return v + 'th';
  return v + ({ 1: 'st', 2: 'nd', 3: 'rd' }[v % 10] || 'th');
};

/** A stored frequency sentence, read back into parts. */
export function parseFrequency(raw) {
  const t = norm(raw);
  if (!t) return { kind: '', raw: '' };

  let m = /^every (?:(\d+) )?(day|week|month|quarter|year)s?$/i.exec(t);
  if (m) return { kind: 'every', n: Number(m[1] || 1), unit: m[2].toLowerCase(), raw: t };

  m = /^(1st|2nd|3rd|4th|last) (monday|tuesday|wednesday|thursday|friday|saturday|sunday) of the month$/i.exec(t);
  if (m) {
    const day = m[2].toLowerCase();
    return { kind: 'nth', ordinal: m[1].toLowerCase(),
      weekday: day.charAt(0).toUpperCase() + day.slice(1), raw: t };
  }

  m = /^on the ((?:\d+(?:st|nd|rd|th))(?:(?:,| and) (?:the )?\d+(?:st|nd|rd|th))*) of the month$/i.exec(t);
  if (m) {
    const days = (m[1].match(/\d+/g) || []).map(Number).filter((d) => d >= 1 && d <= 31);
    if (days.length) return { kind: 'days', days, raw: t };
  }

  m = /^on (\d{4}-\d{2}-\d{2})$/.exec(t);
  if (m) return { kind: 'date', date: m[1], raw: t };

  return { kind: 'irregular', text: t, raw: t };
}

/** Parts back into the sentence that gets written to the file. */
export function renderFrequency(f) {
  if (!f || !f.kind) return '';
  if (f.kind === 'every') {
    const n = Math.max(1, Number(f.n) || 1);
    const u = FREQ_UNITS.includes(f.unit) ? f.unit : 'week';
    return n === 1 ? `every ${u}` : `every ${n} ${u}s`;
  }
  if (f.kind === 'nth') {
    const o = FREQ_ORDINALS.includes(f.ordinal) ? f.ordinal : '1st';
    const w = WEEKDAYS.includes(f.weekday) ? f.weekday : 'Monday';
    return `${o} ${w} of the month`;
  }
  if (f.kind === 'days') {
    const days = [...new Set((f.days || []).map(Number).filter((d) => d >= 1 && d <= 31))].sort((a, b) => a - b);
    if (!days.length) return '';
    const parts = days.map(ORD);
    const last = parts.pop();
    return `on the ${parts.length ? parts.join(', ') + ' and ' + last : last} of the month`;
  }
  if (f.kind === 'date') return f.date ? `on ${f.date}` : '';
  return norm(f.text || '');
}

/** Depends-on holds several job titles in one cell; titles contain commas. */
export const splitDeps = (raw) => String(raw || '').split(';').map((x) => x.trim()).filter(Boolean);
export const joinDeps = (list) => (list || []).map((x) => String(x).trim()).filter(Boolean).join('; ');
/* Retired 2026-09-01. A four-value confidence scale plus a "confirmed by" name
   asked the same question twice, and the answer was already sitting in the
   provenance line under every job. What replaced it is one bit: signed off, or
   not. Kept here only so an old file still parses. */
export const CONFIDENCE = ['Confirmed', 'Described', 'Derived'];

// Column names are matched by NAME, never position. This is what lets the
// format gain a column later without breaking files written today.
const FIELD_ALIASES = {
  who: ['who', 'who does it', 'role', 'done by'],
  depends: ['depends on', 'depends', 'dependencies', 'blocked by'],
  frequency: ['frequency', 'freq', 'how often'],
  duration: ['duration', 'how long'],
  signoff: ['sign-off', 'signoff', 'signed off', 'signed'],
  // read-only, for files written before 2026-09-01
  confidence: ['confidence', 'evidence'],
  confirmedBy: ['confirmed by', 'confirmed']
};

const SCAN_OPEN = '<!-- jobmap:scan -->';
const SCAN_CLOSE = '<!-- /jobmap:scan -->';

// ---------------------------------------------------------------- small helpers

function norm(s) { return String(s == null ? '' : s).trim(); }

/** Split a markdown table row into cells, honouring escaped pipes. */
export function splitRow(line) {
  const out = [];
  let cur = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '\\' && line[i + 1] === '|') { cur += '|'; i++; continue; }
    if (c === '|') { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  // A well-formed row starts and ends with a pipe, producing empty edge cells.
  if (out.length && norm(out[0]) === '') out.shift();
  if (out.length && norm(out[out.length - 1]) === '') out.pop();
  return out.map(norm);
}

/** A cell is one line of a table row, so a newline or bare pipe would corrupt it. */
export function cellSafe(v) {
  return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|').trim();
}

function isTableRow(line) { return /^\s*\|/.test(line); }
function isDivider(line) { return /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes('-'); }

/** Map a header row to our field keys. Returns null if it is not a field table. */
function readFieldHeader(line) {
  const cells = splitRow(line).map((c) => c.toLowerCase());
  const map = {};
  let hits = 0;
  cells.forEach((cell, i) => {
    for (const key of Object.keys(FIELD_ALIASES)) {
      if (FIELD_ALIASES[key].includes(cell)) { map[key] = i; hits++; return; }
    }
  });
  // Require Stage or Confidence to be present, so a group scan table is not
  // mistaken for a per-job field table.
  if (!hits || (map.who === undefined && map.stage === undefined && map.confidence === undefined)) return null;
  return map;
}

// ---------------------------------------------------------------- statement

/**
 * A job statement is a situation, a need and an outcome. Anything that does not
 * split into all three is kept verbatim and reported malformed — an unparseable
 * statement is a finding, not an error to be silently normalised.
 */
export function parseStatement(text) {
  const flat = norm(text.replace(/\s+/g, ' '));
  const m = /^when\s+([\s\S]+?),\s*i need\s+([\s\S]+?),\s*so that\s+([\s\S]+?)\.?$/i.exec(flat);
  if (!m) return { when: '', need: '', so: '', raw: flat, malformed: true };
  return { when: norm(m[1]), need: norm(m[2]), so: norm(m[3]).replace(/\.$/, ''), raw: flat, malformed: false };
}

export function renderStatement(st) {
  if (st.malformed) return st.raw;
  return `When ${st.when}, I need ${st.need}, so that ${st.so}.`;
}

/** Wrap a statement as a markdown blockquote at a sane width. */
function quoteWrap(text, width = 92) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > width) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines.map((l) => '> ' + l);
}

// ---------------------------------------------------------------- parse

/**
 * Parse a jobs document into segments whose `src` arrays concatenate back to the
 * original file exactly. That invariant is what makes round-tripping possible.
 */
export function parseDocument(text) {
  const lines = text.split('\n');
  const segments = [];
  let title = '';

  const titleLine = lines.findIndex((l) => /^#\s+/.test(l));
  if (titleLine !== -1) title = norm(lines[titleLine].replace(/^#\s+/, ''));

  // Section boundaries: every '## ' heading starts one; everything before the
  // first is preamble.
  const bounds = [];
  lines.forEach((l, i) => { if (/^##\s+(?!#)/.test(l)) bounds.push(i); });

  const pushRaw = (from, to) => {
    if (to > from) segments.push({ kind: 'raw', src: lines.slice(from, to), dirty: false });
  };

  if (!bounds.length) {
    pushRaw(0, lines.length);
    return { title, segments };
  }

  pushRaw(0, bounds[0]);

  for (let b = 0; b < bounds.length; b++) {
    const start = bounds[b];
    const end = b + 1 < bounds.length ? bounds[b + 1] : lines.length;
    const body = lines.slice(start, end);

    // A section is a GROUP only if it holds job blocks. Anything else — the
    // closing "How this document stays current" section, for instance — is raw.
    const jobStarts = [];
    body.forEach((l, i) => { if (/^###\s+(?!#)/.test(l)) jobStarts.push(i); });
    if (!jobStarts.length) { pushRaw(start, end); continue; }

    const group = {
      kind: 'group',
      name: norm(body[0].replace(/^##\s+/, '')),
      headingSrc: [body[0]],
      introSrc: body.slice(1, jobStarts[0]),
      jobs: [],
      dirty: false
    };

    for (let j = 0; j < jobStarts.length; j++) {
      const js = jobStarts[j];
      const je = j + 1 < jobStarts.length ? jobStarts[j + 1] : body.length;
      group.jobs.push(parseJob(body.slice(js, je)));
    }
    segments.push(group);
  }

  return { title, segments };
}

function parseJob(src) {
  const job = {
    kind: 'job',
    src,
    dirty: false,
    title: norm(src[0].replace(/^###\s+/, '')),
    statement: null,
    fields: { who: '', depends: '', frequency: '', duration: '', signoff: '',
              stage: '', parent: '', confidence: '', confirmedBy: '' },
    hasFieldTable: false,
    bodySrc: []
  };

  let i = 1;
  while (i < src.length && norm(src[i]) === '') i++;

  // Statement — a run of blockquote lines.
  const qStart = i;
  while (i < src.length && /^\s*>/.test(src[i])) i++;
  if (i > qStart) {
    const text = src.slice(qStart, i).map((l) => l.replace(/^\s*>\s?/, '')).join(' ');
    job.statement = parseStatement(text);
    job.statementRange = [qStart, i];
  } else {
    job.statement = { when: '', need: '', so: '', raw: '', malformed: true };
    job.statementRange = [qStart, qStart];
  }

  let j = i;
  while (j < src.length && norm(src[j]) === '') j++;

  // Optional field table.
  if (j < src.length && isTableRow(src[j])) {
    const map = readFieldHeader(src[j]);
    if (map && j + 2 < src.length && isDivider(src[j + 1]) && isTableRow(src[j + 2])) {
      const cells = splitRow(src[j + 2]);
      for (const key of Object.keys(map)) job.fields[key] = norm(cells[map[key]] || '');
      job.hasFieldTable = true;
      job.fieldRange = [j, j + 3];
      j += 3;
    }
  }

  job.bodySrc = src.slice(j);
  job.bodyRange = [j, src.length];

  // Confidence may only exist in the trailing italic provenance line on a file
  // that has not been migrated. Read it for display, but mark it inferred so
  // the UI never presents a guess as a recorded value.
  if (!job.fields.confidence) {
    const body = job.bodySrc.join('\n');
    const m = /\b(Confirmed|Described|Derived)\b/.exec(body);
    if (m) { job.fields.confidence = m[1]; job.confidenceInferred = true; }
  }
  return job;
}

// ---------------------------------------------------------------- serialize

function renderFieldTable(f) {
  return [
    '| Who | Depends on | Frequency | Duration | Sign-off |',
    '| --- | --- | --- | --- | --- |',
    `| ${[f.who, f.depends, f.frequency, f.duration, f.signoff].map(cellSafe).join(' | ')} |`
  ];
}

function jobIsDirty(job) {
  return !!(job.dirty || job.dirtyTitle || job.dirtyStatement || job.dirtyFields || job.dirtyBody);
}

function renderJobFresh(job) {
  const out = [`### ${job.title}`, ''];
  out.push(...quoteWrap(renderStatement(job.statement)));
  out.push('', ...renderFieldTable(job.fields));
  const body = job.bodySrc.slice();
  while (body.length && norm(body[0]) === '') body.shift();
  if (body.length) out.push('', ...body);
  else out.push('');
  return out;
}

function renderJob(job) {
  if (!jobIsDirty(job)) return job.src;
  if (!job.src || !job.src.length) return renderJobFresh(job);

  const out = job.src.slice();
  // Splice bottom-up so the ranges captured at parse time stay valid: the body
  // sits after the field table, which sits after the statement, which sits
  // after the heading.
  if (job.dirty || job.dirtyBody) {
    const [a, b] = job.bodyRange;
    out.splice(a, b - a, ...job.bodySrc);
  }
  if (job.dirty || job.dirtyFields) {
    const table = renderFieldTable(job.fields);
    if (job.fieldRange) out.splice(job.fieldRange[0], job.fieldRange[1] - job.fieldRange[0], ...table);
    else out.splice(job.statementRange[1], 0, '', ...table);
  }
  if (job.dirty || job.dirtyStatement) {
    const [a, b] = job.statementRange;
    out.splice(a, b - a, ...quoteWrap(renderStatement(job.statement)));
  }
  if (job.dirty || job.dirtyTitle) out[0] = `### ${job.title}`;
  return out;
}

/** Mark exactly what changed, so nothing else is re-rendered. */
export function touch(job, what) {
  if (what === 'body') job.dirtyBody = true;
  else if (what === 'title') job.dirtyTitle = true;
  else if (what === 'statement') job.dirtyStatement = true;
  else if (what === 'fields') job.dirtyFields = true;
  else job.dirty = true;
  return job;
}

/** The scan table is derived from the jobs, never stored twice. */
function renderScan(group) {
  const rows = [
    '| Job | Who | Sign-off | Today |',
    '| --- | --- | --- | --- |'
  ];
  for (const job of group.jobs) {
    const today = (job.bodySrc.find((l) => /^Today:/i.test(norm(l))) || '')
      .replace(/^Today:\s*/i, '').slice(0, 90);
    rows.push(`| ${[job.title, job.fields.who, job.fields.signoff, today].map(cellSafe).join(' | ')} |`);
  }
  return [SCAN_OPEN, ...rows, SCAN_CLOSE];
}

/**
 * Replace a generated scan block in the intro, if one is present. An intro that
 * has never been generated is left exactly as the user wrote it — we do not
 * convert a hand-written scan table behind their back.
 */
function renderIntro(group) {
  const src = group.introSrc;
  const open = src.findIndex((l) => norm(l) === SCAN_OPEN);
  if (open === -1) return src;
  const close = src.findIndex((l, i) => i > open && norm(l) === SCAN_CLOSE);
  if (close === -1) return src;
  return [...src.slice(0, open), ...renderScan(group), ...src.slice(close + 1)];
}

export function serializeDocument(doc) {
  const out = [];
  for (const seg of doc.segments) {
    if (seg.kind === 'raw') { out.push(...seg.src); continue; }
    const anyDirty = seg.dirty || seg.jobs.some(jobIsDirty);
    if (!anyDirty) {
      out.push(...seg.headingSrc, ...seg.introSrc);
      for (const job of seg.jobs) out.push(...job.src);
      continue;
    }
    out.push(...seg.headingSrc, ...renderIntro(seg));
    for (const job of seg.jobs) out.push(...renderJob(job));
  }
  return out.join('\n');
}

// ---------------------------------------------------------------- verification

/** Parse then serialize with zero edits and byte-compare. The app's open gate. */
export function verifyRoundTrip(text) {
  let produced;
  try { produced = serializeDocument(parseDocument(text)); }
  catch (e) { return { ok: false, line: 0, expected: '', produced: '', error: e.message }; }
  if (produced === text) return { ok: true };
  const a = text.split('\n');
  const b = produced.split('\n');
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return { ok: false, line: i + 1, expected: a[i] === undefined ? '(end of file)' : a[i],
        produced: b[i] === undefined ? '(end of file)' : b[i] };
    }
  }
  return { ok: false, line: 0, expected: '', produced: '' };
}

/**
 * Remove a job from the file.
 *
 * Marking the group dirty makes it re-render, and a clean job renders as its
 * own source lines, so every other job in the group comes out byte-identical.
 *
 * A job that named this one as its Parent would be left pointing at nothing —
 * a step on a map with no map — so those are cleared and reported back rather
 * than silently orphaned.
 */
export function removeJob(doc, job) {
  let host = null;
  for (const seg of doc.segments) {
    if (seg.kind !== 'group') continue;
    const i = seg.jobs.indexOf(job);
    if (i < 0) continue;
    seg.jobs.splice(i, 1);
    seg.dirty = true;
    host = seg;
    break;
  }
  if (!host) return { ok: false, orphans: 0 };
  let orphans = 0;
  for (const seg of doc.segments) {
    if (seg.kind !== 'group') continue;
    for (const j of seg.jobs) {
      if (j.fields.parent && j.fields.parent === job.title) {
        j.fields.parent = '';
        touch(j, 'fields');
        orphans++;
      }
    }
  }
  return { ok: true, orphans };
}

export function allJobs(doc) {
  const out = [];
  for (const seg of doc.segments) if (seg.kind === 'group') for (const j of seg.jobs) out.push(j);
  return out;
}

export function countJobs(doc) { return allJobs(doc).length; }

// ---------------------------------------------------------------- lint

const SOLUTION_WORDS = ['screen', 'page', 'tab', 'button', 'dashboard', 'dropdown', 'checkbox',
  'popup', 'modal', 'toolbar', 'menu', 'wizard', 'click', 'spreadsheet', 'excel', 'macro'];

/**
 * Flags, never blocks, and never rewrites. "A process is how it's done today;
 * a job is what someone is trying to achieve regardless of how."
 */
export function lintJob(job) {
  const issues = [];
  const text = (job.statement && job.statement.raw ? job.statement.raw : '').toLowerCase();
  const hits = SOLUTION_WORDS.filter((w) => new RegExp(`\\b${w}s?\\b`).test(text));
  if (hits.length) issues.push({ kind: 'smuggled-solution', words: hits });
  if (job.statement && job.statement.malformed) issues.push({ kind: 'malformed-statement' });
  return issues;
}

/**
 * Locate a hand-written scan table in a group's intro, so migration can replace
 * it with a generated one. Matched by header content, never position.
 */
export function findScanTable(introSrc) {
  for (let i = 0; i < introSrc.length; i++) {
    if (!isTableRow(introSrc[i])) continue;
    const cells = splitRow(introSrc[i]).map((c) => c.toLowerCase());
    if (!cells.includes('job')) continue;
    if (!cells.includes('today') && !cells.includes('evidence')) continue;
    if (i + 1 >= introSrc.length || !isDivider(introSrc[i + 1])) continue;
    let end = i + 2;
    while (end < introSrc.length && isTableRow(introSrc[end])) end++;
    return [i, end];
  }
  return null;
}

export function renderScanBlock(group) { return renderScan(group); }

/**
 * Create a job during a live session. It has no source lines yet, so it renders
 * fresh; every later edit is a splice like any other job.
 *
 * Confidence defaults to Described, not Confirmed: someone saying a thing in a
 * room is not the same as the person who does it reading it back and agreeing.
 */
export function addJob(group, { title, statement, saidBy, date, confidence }) {
  const conf = confidence || 'Described';
  const who = (saidBy || '').trim();
  const when = date || new Date().toISOString().slice(0, 10);
  const job = {
    kind: 'job',
    src: [],
    dirty: true,
    title: String(title || '').trim(),
    statement: statement ? parseStatement(statement)
      : { when: '', need: '', so: '', raw: String(title || '').trim(), malformed: true },
    fields: { who: '', depends: '', frequency: '', duration: '', signoff: '',
              stage: '', parent: '', confidence: conf, confirmedBy: '' },
    hasFieldTable: true,
    statementRange: [0, 0],
    fieldRange: null,
    bodyRange: [0, 0],
    bodySrc: [
      'Today: not described.',
      '',
      `*${conf} by ${who || 'someone in the room'}, ${when}, in session. Nothing else has been asked.*`
    ]
  };
  group.jobs.push(job);
  group.dirty = true;
  return job;
}

/** Add a group, after the last existing one so trailing prose stays at the end. */
export function addGroup(doc, name) {
  const group = {
    kind: 'group', name: String(name || '').trim(),
    headingSrc: [`## ${String(name || '').trim()}`],
    introSrc: [''],
    jobs: [], dirty: true
  };
  let last = -1;
  doc.segments.forEach((s, i) => { if (s.kind === 'group') last = i; });
  if (last === -1) doc.segments.push(group);
  else doc.segments.splice(last + 1, 0, group);
  return group;
}

/** Every distinct role named on a job, with the jobs each one does. */
export function roles(doc) {
  const by = new Map();
  for (const j of allJobs(doc)) {
    const r = norm(j.fields.who);
    if (!r) continue;
    if (!by.has(r)) by.set(r, []);
    by.get(r).push(j);
  }
  return [...by.entries()]
    .map(([name, jobs]) => ({ name, jobs }))
    .sort((a, b) => b.jobs.length - a.jobs.length || a.name.localeCompare(b.name));
}

/** Jobs with no role on them. The question this app exists to surface. */
export function unroled(doc) { return allJobs(doc).filter((j) => !norm(j.fields.who)); }

/* ---------------------------------------------------------------- groups */

export function groupsOf(doc) { return doc.segments.filter((s) => s.kind === 'group'); }

export function renameGroup(doc, group, name) {
  const to = norm(name);
  if (!to || to === group.name) return false;
  group.name = to;
  group.headingSrc = ['## ' + to];
  group.dirty = true;
  return true;
}

/** Move a group up or down among the groups, leaving raw blocks where they are. */
export function moveGroup(doc, group, dir) {
  const idx = doc.segments.indexOf(group);
  if (idx < 0) return false;
  const spots = doc.segments.map((s, i) => (s.kind === 'group' ? i : -1)).filter((i) => i >= 0);
  const at = spots.indexOf(idx);
  const to = at + dir;
  if (to < 0 || to >= spots.length) return false;
  const other = spots[to];
  const tmp = doc.segments[idx];
  doc.segments[idx] = doc.segments[other];
  doc.segments[other] = tmp;
  doc.segments[idx].dirty = true;
  doc.segments[other].dirty = true;
  return true;
}

/** Find or create the junk drawer that holds jobs with no category. */
export function unassignedGroup(doc) {
  const found = groupsOf(doc).find((g) => g.name === UNASSIGNED);
  return found || addGroup(doc, UNASSIGNED);
}

export function moveJob(doc, job, toGroup) {
  for (const g of groupsOf(doc)) {
    const i = g.jobs.indexOf(job);
    if (i < 0) continue;
    if (g === toGroup) return false;
    g.jobs.splice(i, 1);
    g.dirty = true;
    toGroup.jobs.push(job);
    toGroup.dirty = true;
    return true;
  }
  return false;
}

/**
 * Delete a category. `mode` is 'jobs' to delete everything inside it, or
 * 'keep' to move those jobs to the Unassigned drawer. There is no default:
 * losing somebody's jobs by accident is not a thing to make easy.
 */
export function removeGroup(doc, group, mode) {
  const i = doc.segments.indexOf(group);
  if (i < 0) return { ok: false, moved: 0, deleted: 0 };
  const held = group.jobs.slice();
  let moved = 0;
  if (mode === 'keep' && held.length) {
    const drawer = unassignedGroup(doc);
    if (drawer === group) return { ok: false, moved: 0, deleted: 0 };
    for (const j of held) { drawer.jobs.push(j); moved++; }
    drawer.dirty = true;
  }
  doc.segments.splice(doc.segments.indexOf(group), 1);
  // a raw block that held only the separator before this group would now float
  return { ok: true, moved, deleted: mode === 'keep' ? 0 : held.length };
}

export function blankJobsFile(title) {
  return [
    `# Jobs to be Done — ${title}`,
    '',
    'A job is an achievement, not a task. Each job is written as a situation, a need,',
    'and an outcome, so it can be read on its own.',
    '',
    '- **Confirmed** — the person who does this job has read it and agreed.',
    '- **Described** — someone talked about it in a recorded session.',
    '- **Derived** — taken from documentation or a file. Nobody has been asked.',
    '',
    '---',
    '',
    '## Unsorted',
    '',
    '### A job nobody has written yet',
    '',
    '> When something happens, I need to achieve something, so that an outcome holds.',
    '',
    ...renderFieldTable({ who: '', depends: '', frequency: '', duration: '', signoff: '' }),
    '',
    'Today: not described.',
    '',
    '*Derived. Nobody has been asked.*',
    ''
  ].join('\n');
}
