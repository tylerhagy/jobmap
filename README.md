# jobmap

A jobs-to-be-done editor over a markdown file. Sibling to [ORCA](../ooux) for object maps and
[protoserve](../protoserve) for prototype comments.

**The markdown is the source of truth.** jobmap owns addressed spans inside the file and nothing
else: it will not reformat a line you did not edit, and it will not write a file it has not first
proven it can reproduce byte-for-byte. The same file stays editable in Obsidian.

```bash
jobmap            # serves this folder on :8043 and opens Chrome
```

Then **Open folder** and pick the directory holding your jobs file.

---

## The format

A job is a `###` heading, a statement, a field table, and prose. Everything else in the file —
preamble, rubric, group intros, notes — is preserved verbatim.

```markdown
## Producer Payments

### Correct an error without reopening a month that's already paid

> When something was paid wrong, I need to put it right on a future payment rather
> than editing a closed month, so that the accounting stays sound and nothing already
> settled moves.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
| Payments | Pay a producer once, in a form they can reconcile | | | |

Today: absolute. Priya Castellan: "We don't go back and change anything that's been paid, ever."

*Described by Priya Castellan, 2026-08-03, categorically and without hedging.*
```

| Field | Means |
|---|---|
| **Who** | The role that does it, not the person. Picked from the roles already in the file, so one role is never spelled two ways. Blank means nobody has said. |
| **Depends on** | *Optional.* Other jobs this one waits on, semicolon separated. Several is normal, and none of them owns it. |
| **Frequency** | *Optional.* How often the job happens, built from a picker rather than typed. Five shapes: `every 2 weeks`, `3rd Thursday of the month`, `on the 5th and 25th of the month`, `on 2026-10-18`, or free text for a job that fires on an event rather than a date. **The file still stores the sentence**, so it reads normally in Obsidian. |
| **Duration** | *Optional.* How long it takes. Neither this nor frequency can be filled in from a desk. |
| **Sign-off** | `signed YYYY-MM-DD` once the person who does the job has read it back and agreed. Blank otherwise. |

Only the title and the three-part statement are required. Everything else is blank until somebody has been asked.

**Confidence and Confirmed by were retired on 2026-09-01.** A four-value scale plus a name asked the same question twice, and the answer was already in the provenance line under every job. What replaced them is one bit — signed off, or not — the same bit ORCA uses on a row, for the same reason.

**Stage and Parent were retired on 2026-09-02**, along with the job-map view they existed to feed. A parent said *this job is a step inside that one*, which is the wrong relationship to model: what people actually say is *I can't do this until that has happened*. That is **Depends on**, it points at as many jobs as it needs to, and it implies no hierarchy.

Old files still open either way — all four columns are still read, so nothing written before those dates breaks.

**Columns are matched by name, never position.** Reorder them, add one, leave one out — old files
keep working.

**Blank is not the same as `—`.** Blank means nobody has been asked. `—` means not applicable.
Nothing is ever auto-filled to make a table look complete.

---

## The views

There are two, because there are two questions.

**Jobs** — a rail of categories on the left, the jobs in the one you pick on the right. Add, rename,
reorder and delete categories from the rail. Deleting one that holds jobs asks which you mean: move
them to **Unassigned** — the junk drawer, drawn dashed so it never reads as a category somebody
chose — or delete them with it, which asks a second time because it cannot be undone.

**Roles** — every role, and what each is on the hook for, with **Nobody named** at the bottom. That
last block is the point of the view: until a job has a role on it, there is no one to read it back.

**Source** — exactly what jobmap would write to the file, read-only. It sits with the other views in
the bar rather than as a link at the bottom of every job list, because it is a view, not part of the
content. `S` toggles it.

A job's detail is not a fourth view; you get there by clicking a job, and the back link returns you
to the category you came from.

The header carries the only number that matters: **how many jobs have been read back to the person
who does them.** It is a count, never a progress bar — a jobs list is not a thing you finish, and a
bar implying otherwise would be a lie in visual form.

Sign-off is shown only where it is news. Not-signed-off is the state of nearly every job in a young
file and gets no ink at all, because absence already means nobody has agreed it — exactly what the
file means by a blank. Signed off is marked, and so is *who does it* where somebody has said.

**Roles are picked, never typed.** A free-text box lets *Payments team*, *Payments Team* and
*paymnets team* become three roles that are one role, which would make the Roles view a liar. So the
field is a list of the roles already in the file plus *add a role* — a deliberate act with its own
dialog, rather than a side effect of typing.

**How often is picked, not typed.** "Every 2 weeks", "the 3rd Thursday" and "the 5th and the 25th"
are different kinds of answer, and a text box flattens them into prose you cannot group by later. So
the field is a shape picker that composes the sentence. The fifth shape is **irregular**, free text,
and it is not a cop-out: most of these jobs fire when a file lands or a producer calls, and making
those choose a calendar would record a schedule nobody keeps.

**Every job is in three parts.** A statement that will not split used to render as one grey
*kept verbatim* box: it told you something was wrong and gave you no way to put it right. The three
boxes are always there now; when the original could not be split it goes into *When* whole and says
so, and fixing it is typing.

---

## Running a session

jobmap is built to be driven in front of people, not only used alone.

**`P` — present.** Big type, rail hidden, readable on a shared screen. `Escape` exits.

**`C` — capture.** A dialog in the middle of the screen: one box, plus which group and who said it.
Type what someone said, press Enter, it becomes a job. The box clears and keeps focus, so you can
take statements at the speed people talk instead of stopping to fill in a form. `Escape` closes.

*It used to be a bar along the bottom edge. You press a button at the top of the window, something
small appears at the very bottom, and your eyes never go there — so the feature may as well not
have existed. Being findable beat being unobtrusive.*

Captured jobs land unsigned and carry who said it and the date, because someone saying a thing in a
room is not the same as the person who does it reading it back and agreeing.

**The referee.** While you type, the tool watches for today's process creeping in. Type *"we need a
dashboard showing which files are stuck"* and it says, in a size the room can read:

> **dashboard** — that is how it is done today, not what they are trying to achieve.
> **Ask: and what does that get you?**

The point is that the screen says the awkward part, not the facilitator. Nobody has to be corrected
by a person.

**Ask the room.** Under the job map, every stage nobody has described becomes a question you can
read out — *"How do they check it is right before they commit?"*, *"What happens when it goes
wrong?"*. The gaps stop being a status report and become the agenda.

### The lint

Two checks, both flagged and never blocking, because an odd statement is a finding rather than an
error to correct automatically:

- **Smuggled solution** — a statement mentioning a screen, a button, a dashboard, a spreadsheet.
  *A process is how it's done today; a job is what someone is trying to achieve regardless of how.*
- **Malformed statement** — anything that is not a situation, a need and an outcome. Kept exactly
  as written.

Ordinary business words are deliberately not flagged. "In a form they can reconcile", "when I
report our position" and a gas *field* are all normal language, and a linter that cries wolf is one
you learn to ignore.

---

## Working on it

```bash
node test.mjs                    # the gate — parser round-trip, idempotency, one-edit-one-line
node validate.mjs <file.md>      # OK / NOT A JOBS FILE / READ-ONLY
node validate.mjs --dir <folder>
node browser-test.mjs            # drives the real app in Chromium (needs playwright; skips without)
node migrate.mjs <src> <dest>    # one-shot: add field tables to a hand-written file
```

**`test.mjs` is the gate on everything else. If it does not pass, do not use the app to write.**

`validate.mjs` exists so that anything *generating* a jobs file can prove the result is editable
before handing it over. The app's read-only check and the CLI run the identical function, so the
agent and the app can never disagree about whether a file is safe.

---

## Decisions worth knowing

**Port 8043 is pinned.** File System Access folder grants are keyed to the origin including the
port, so a stable port is what makes "remember my folder" work between sessions. ORCA holds 8042.

**One jobs file per folder.** The app lists every `.md` in the folder you point it at. Give it a
folder of its own — `Jobs (jobmap)/` beside `Object Map (ORCA)/` — and there is never any question
which file it means.

**Chromium only, over http.** The File System Access API does not exist elsewhere, and opening
`index.html` as a file gives you a module that cannot import. Both cases are caught at boot with a
banner that says which.

**Saving is explicit and conflict-checked.** If the file changed on disk since you opened it, you
are asked before anything is overwritten, and the previous contents go into a ten-deep backup ring
first. After writing, jobmap re-parses its own bytes so the model can never drift from the file.

**Migration is a separate script, never app behaviour.** `migrate.mjs` refuses to run unless the
source round-trips, writes to a destination path, and never touches the source. It is the only
wholesale rewrite that ever happens; everything after it is a one-line diff.

**Nothing arrives pre-filled.** Seeded jobs are `Derived`. Confirmed is something a person does.

## Licence

MIT
