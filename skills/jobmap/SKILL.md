---
name: jobmap
description: Draft a jobs-to-be-done list from whatever notes exist, validate that it round-trips, and open it in the jobmap editor. Use when someone wants to start a jobs-to-be-done list, work out what people are trying to achieve rather than today's process, seed a jobs list from research or notes, or open jobmap. Trigger phrases include "jobs to be done", "start a jobs list", "what are people trying to achieve", "jobs not screens", or "open jobmap". Drafting is this skill's job; editing is jobmap's.
allowed-tools:
  - Bash(jobmap *)
  - Bash(node *)
  - Bash(open *)
  - Read
  - Write
  - Glob
  - Grep
---

# jobmap — draft a jobs-to-be-done list, then hand it over

Setup is this skill's job; editing is jobmap's. **Never edit an existing jobs
file — once it exists, jobmap owns it.** Double ownership is how a file gets
reformatted behind someone's back.

## What it is

A job is an achievement, not a task. "Run the recalculate command" is a task
and it disappears with the software. "Know the numbers are right before money
moves" is a job and it survives the replacement. Keeping the two apart is the
whole point: the fastest way to build the wrong thing is to mistake today's
process for the requirement.

## The shape of a run

1. **Find the material.** Whatever the project already has: a brief, product
   notes, research session notes, an object map, a glossary, support tickets,
   existing docs. Read before drafting.
2. **Choose a folder.** jobmap lists every `.md` in the folder it is pointed
   at, so the jobs file gets a folder of its own — `Jobs (jobmap)/` beside the
   project's other notes is a good convention. **Never overwrite an existing
   jobs file.**
3. **Draft the file** in the shape below.
4. **Validate — mandatory:**
   ```bash
   cd <path-to-jobmap> && node validate.mjs "<path to the new file>"
   ```
   It must report `OK` with a non-zero job count. If it reports `READ-ONLY`,
   the markdown is malformed — fix it and re-run. **Never open the UI on a
   file that failed validation.**
5. **Launch** with `jobmap`, then give the absolute folder path to paste into
   the folder picker — a browser picker cannot be driven programmatically.

## The file shape

```markdown
# Jobs to be Done — [Product or Thread]

A job is an achievement, not a task. Each job is written as a situation, a
need, and an outcome, so it can be read on its own.

---

## [User population]

[One paragraph: who these people are, and what they are responsible for.]

### [Job title — a verb phrase naming an achievement]

> When [situation], I need [need], so that [outcome].

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: [how the work is done now, or "not described anywhere".]

*[Where this came from, and what has not been asked.]*
```

- `Who` is the role that does the job, not the person, picked from roles
  already in the file so one role is never spelled two ways.
- `Depends on` names other jobs this one waits on — an ordinary dependency,
  not a hierarchy. It can point at several.
- `Frequency` and `Duration` cannot be filled in from a desk; they come from
  watching the work.
- `Sign-off` is `signed YYYY-MM-DD` once the person who does the job has read
  it back and agreed. Blank otherwise.
- Only the title and the three-part statement are required. Everything else
  is blank until somebody has been asked.

An older file may still carry a **Stage**, **Confidence**, **Confirmed by** or
**Parent** column — those were retired in favour of `Depends on` and the
single `Sign-off` bit, but jobmap still reads them so a file written before
the retirement still opens and round-trips. Never add them to a new file.

## The one rule that matters most

**A job needs a source, not a plausible guess.** `Who`, `Depends on`,
`Frequency` and `Duration` are left blank, because blank means nobody has been
asked and that is the honest default. A list padded with invented jobs is
worse than a short one, because the invented jobs look exactly like the
sourced ones.

**Sign-off is always blank on a new list.** Nothing arrives pre-agreed; that
is the entire point of the column. Aim for 12–25 jobs and stop rather than
pad.

**Group by user population, not by feature area.** Who does this work, named
where the source names them.

**If a candidate job names a screen, a button, a spreadsheet or a report**, it
is probably today's process rather than an achievement. Write the achievement,
or leave it out — jobmap's own referee flags this live during capture, but a
draft should not need correcting for it.

## Running a session

jobmap is a facilitation instrument as much as an editor. When the request is
about running a session rather than drafting a file, seed the file, then hand
over the two keys and stop:

- **`P`** — present mode. Big type for a shared screen. `Escape` exits.
- **`C`** — capture. One box; type what someone said, press Enter, next.
  Captured jobs land unsigned, carrying who said it and the date. A live
  referee flags today's process creeping in before it becomes a job.
- **Ask the room** — every gap the file doesn't yet describe becomes a
  question that can be read out loud. The gaps are the agenda.

Do not narrate the interface. Whoever is running the room drives the tool; it
is their instrument, not the facilitator.

## Never

- Edit an existing jobs file. jobmap owns it once it exists.
- Mark anything `signed`, or fill in `Frequency` or `Duration`. Only a person
  reading their own job back, or watching the work, can do that.
- Invent a job to round out a group. An empty group is a finding.
- Open the UI on a file that failed validation.
