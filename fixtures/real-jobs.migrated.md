# Jobs to be Done — Unified Grower Platform

The Unified Grower Platform will replace two systems that Meridian uses to buy natural gas from local producers and pay them for it. This document lists what the people who do that work are trying to accomplish.

A job is an achievement, not a task. "Run the recalculate command" is a task and it will disappear with the old software. "Know the numbers are right before money moves" is a job, and it will still be true in the new system. Keeping the two apart is the point of this document: on a replacement project, the fastest way to build the wrong thing is to rebuild today's process because you mistook it for the requirement.

Each job is written as a situation, a need, and an outcome, so it can be read on its own. Under each one is a note on how the work gets done today, and a line saying how well we actually know it.

**How to read the confidence line.** Every job ends with one of three:

- **Confirmed** — the person who does this job has read it and agreed. Names them and dates it.
- **Described** — someone talked about it in a recorded session. Often a colleague rather than the person doing it.
- **Derived** — taken from documentation or from a file. Nobody has been asked.

*As of 2026-08-16, nothing here was Confirmed. **Still true on 2026-08-29**, after five estimation sessions and roughly fourteen hours in a room — because every one of those sessions was IT-only. Not one job below has been read back to the person who does it. That is the honest state of this document and it remains the fastest thing to change.*

---

> ⚠ **Read this before trusting anything marked Described.**
>
> On 2026-08-20 the BA and an engineer said the same thing independently about **Nora Whitfield**, who has the widest system access of anyone in the business and is the single most-quoted source in this document:
>
> > *"So many of the things I think that she has said so far have been like, this is what I'm having to do. **She's super ingrained in the workaround and doesn't realize that that experience is actually very workaroundy.**"*
>
> > *"She knows if she does X and field Y on the 7th screen, she can change how a whole contract works, which is pretty scary. But maybe it wasn't designed to do that as much as she just found a way to get around it."*
>
> **This is the strongest argument for a jobs document existing, and a warning about this one's contents at the same time.** Separating the achievement from the workaround is exactly what this document is for — and the people describing their work cannot reliably do that separation themselves. A job written from a session quote may be a genuine achievement, or it may be a band-aid described so fluently it sounds like a requirement.
>
> **The clearest live case is meter renumbering.** It is a stated requirement; the described behaviour is changing a number to force an import through and sometimes changing it back the next day. The room's own reframe is now recorded as its own job below — *keep working when a meter number means different things to different parties*.
>
> **Nothing resolves this except watching the work, and nobody has.**

---

**Reconciled 2026-08-16 against the scope pages and the three scope sessions; refreshed 2026-08-29 against the five estimation sessions (08-19, 08-20, 08-21, 08-27, 08-28) and against 45 screenshots of the running Harvest Ops application** — see [[Legacy Walkthrough — Harvest Ops]].

**What the 2026-08-29 pass changed.** Almost no job was wrong, which is this document's design working: it wrote achievements, and the sessions churned line items. What changed is evidence, and coverage. **Eight jobs were added**, seven of them surfaced by the screenshots — because a capability sitting in the running software implies somebody is trying to achieve something with it, and several of those achievements had never been written down. They are marked **new 2026-08-29** in the scan tables.

⚠ **This pass saw one of the two systems.** Harvest Ops holds 425 of 680+ producers. **Atlas has not been looked at**, and it is the side with stacked amendments, deeper tier structures and prose pricing. Expect it to add jobs, particularly in Contracting and Buying.

**Each section opens with a scan table** — every job in that group on one line, with a few words on how it works today and how well we know it. The full statement, the evidence and the quotes are in the blocks underneath.

---

## Producer Payments

Three people run the monthly payment cycle — **Priya Castellan**, **Renata Okafor** and **Lucas Fennimore**, all Senior Rockies Gas Payment Specialists in Larkspur, Wyoming, reporting to Nora Whitfield. Between them they turn other companies' measurement files into money leaving Meridian.

**The work is divided by pipeline, not by task.** A *source file* is the monthly volume file one pipeline or gatherer sends, listing how much gas came out of each meter. There are around 36, and each person takes their own end to end — Lucas fourteen, Renata eleven, Priya nine. As the documentation puts it: *"These VolDocs are split up amongst the team and each individual is intimate with the particulars of each Spreadsheet."*

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Price a month's gas before an outside deadline |  |  | Palisade data arrives on the 14th or 15th and payment is due on the 20th — five business d |
| Load a file whose format changed without warning |  |  | by hand. Priya Castellan on how much notice they get: "In all the instances I've seen, us |
| Chase a source that hasn't sent its data |  |  | from knowing what should have arrived. A spreadsheet called `Tracker$$.xlsx` holds one row |
| Get a bad file replaced instead of repairing it here |  |  | as an IT escalation, and expensively. Evan Marsh: *"We would spend days trying to figure |
| Find the setup that will fail before the run fails |  |  | there is a screen for exactly this. Harvest Ops's **Meter Check** takes a date and |
| Stop paying on a meter without deleting it, and let others see why |  |  | two fields do this. The meter carries an **`Ignore Volumes`** checkbox, and processed volu |
| Pay a producer once, in a form they can reconcile |  |  | consolidated, but people describe the grouping differently. Priya Castellan: "One payment |
| Correct an error without reopening a month that's already paid |  |  | absolute. Priya Castellan: "We don't go back and change anything that's been paid, ever. |
| Keep a correction attached to the month it belongs to |  |  | handled correctly. Nora Whitfield: "If 10 units were reported with May production and it sho |
| Notice when a meter under contract is missing from a file |  |  | known and handled by the people who do it. Nora Whitfield: "The zeros necessarily aren't rep |
| Send a statement package a producer can run their own accounts from |  |  | a statement plus a spreadsheet, and the spreadsheet cannot change. Nora Whitfield: "We canno |
| Get a statement to the right person, and know it arrived |  |  | split between two people and two channels. Lucas Fennimore emails statements; Priya Schoen |
| Be able to run the cycle again next month without working it out again |  |  | self-provided. Priya Castellan works from a personal "Roll Month Checklist" someone made |
<!-- /jobmap:scan -->

### Price a month's gas before an outside deadline

> When volume files arrive from a dozen pipelines and gatherers on their own schedules, I need to convert, load and price every one of them before the date the pipeline set, so that producers are paid on time.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: Palisade data arrives on the 14th or 15th and payment is due on the 20th — five business days. Meridian sets none of these dates. Payments run twice a month, on the 5th and the 25th.

*Derived from 2023–24 system documentation. The deadlines have never been mentioned in a session and nobody has been asked to confirm them.*

### Load a file whose format changed without warning

> When a gatherer changes its file layout and tells nobody, I need to get the data in anyway, so that the payment run isn't held up while someone rebuilds an import.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: by hand. Priya Castellan on how much notice they get: "In all the instances I've seen, usually it is last minute, yes. With no like, this is a rough draft of what it's going to look like — not even that. I've never had that." One gatherer's monthly file is rebuilt from scratch every month: copy, paste, rename, erase the volumes, change the dating, re-key the numbers, twelve to fifteen files.

*Described by Priya Castellan and Evan Marsh, 2026-08-03. How often formats actually change has never been counted.*

### Chase a source that hasn't sent its data

> When a pipeline or gatherer hasn't sent what I expect for a period, I need to know early enough to go after it, so that a missing file doesn't surface on the day the payment is due.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: from knowing what should have arrived. A spreadsheet called `Tracker$$.xlsx` holds one row per source document with the date received, the date entered, who processed it, and a named external contact at the pipeline or gatherer. That file is the closest thing to a tracking system.

*Derived from documentation of `Tracker$$.xlsx`. Nobody has described how chasing actually works, or what happens when a file is late.*

### Get a bad file replaced instead of repairing it here

> When a gatherer sends a file that is wrong rather than merely differently shaped, I need to establish that quickly and go back to them for a correct one, so that days are not spent reverse-engineering a problem that was never ours to fix.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: as an IT escalation, and expensively. Evan Marsh: *"We would spend days trying to figure out what's going on and then the answer is Gus just has to go get a new file."* Files arrive with stray characters and wrong years — Miles Ostrander: *"they've even sent us nonsense files before with the wrong years on them. Like, oh, it's the year 2025, not the year 2205."*

**This is a relationship problem surfacing as a technical one.** Evan Marsh's read is that the business is capable of handling it themselves and simply has no tool that isn't an ad-hoc database script.

*Described by Evan Marsh and Miles Ostrander, 2026-08-19. **Distinct from the two jobs above it** — this is a file that arrived and is wrong, not one that is late or merely reshaped. How often it happens has never been counted, and nobody has asked Gus Halloran what going back to a gatherer actually costs him.*

### Find the setup that will fail before the run fails

> When a meter has no vendor assigned or no active agreement, I need to find it before the payment run does, so that a configuration gap doesn't surface as a payment that cannot be made.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: there is a screen for exactly this. Harvest Ops's **Meter Check** takes a date and a gatherer and offers four filters — **No Vendor Assigned · No Active Agreement · Has COGEP Charges · Only View Active Meters** — returning producer, gatherer, meter, vendor, agreement and COGEP dates.

**Note what this is not.** "Notice when a meter under contract is missing from a file" is about volumes arriving. This is about the record being incomplete before any volume shows up. Different job, different point in the month, plausibly a different person.

*Derived from the running application, 2026-08-29. **Nobody has said they use it.** Who runs it, how often, and whether it is a monthly ritual or a thing someone remembers in a crisis are all unknown.*

### Stop paying on a meter without deleting it, and let others see why

> When a meter should not be paid on for a period, I need to take it out of processing without destroying its history, and I need the next person to see that a human did that deliberately.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: two fields do this. The meter carries an **`Ignore Volumes`** checkbox, and processed volume rows carry an **`Ignored By`** column recording who. Separately, meters with volume or payment history are deactivated, never deleted.

*Derived from the running application, 2026-08-29. The smallest job here and possibly the most revealing — somebody built an audit trail onto an exclusion switch, which suggests it gets used and gets questioned. No reason for it has ever been described.*

### Pay a producer once, in a form they can reconcile

> When a producer's gas reaches us across several pipelines and several separate deals, I need to pay them in a way they can tie back to their own records, so that they can see what they were paid for without calling us.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: consolidated, but people describe the grouping differently. Priya Castellan: "One payment. It's all one at the end of the day. One dollar amount." Nora Whitfield describes payments landing on different dates depending on the pipeline: "There can be producers that'll be paid on the 25th and the 5th."

*Described by both, 2026-08-03 and 08-11, and they do not agree. **Half settled 2026-08-27:** payments split at the producer level, never the meter — money rolls up meter → producer, then down to payees. The Harvest Ops screenshots agree, keying the payment record on vendor. **The half Nora Whitfield described is still open** — grouping by pipeline and payment date has no representation in the scope model at all. She can still settle it in one conversation.*

### Correct an error without reopening a month that's already paid

> When something was paid wrong, I need to put it right on a future payment rather than editing a closed month, so that the accounting stays sound and nothing already settled moves.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: absolute. Priya Castellan: "We don't go back and change anything that's been paid, ever. We adjust with the next." The tooling enforces it — after payment the spreadsheets are locked and password-protected. This is ordinary period-close accounting, not a limitation of the old system, and it will carry into the new one unchanged.

*Described by Priya Castellan, 2026-08-03, categorically and without hedging. The strongest-evidenced job here.*

**Corroborated twice since.** Settled in Session 4 as a mechanic — prior period adjustments are stored as additive adjustment rows, *"effectively a cancel and a rebill"*, never as mutations of the original. And **visible in the running software**: the Production Volumes tab and a single Payment Details record both show matched negative and positive rows for the same meter and production month, with the negative rendered in red parentheses on the producer's statement. *Derived, 2026-08-29.*

**One caution attached to it.** Julian Reyes pushed back hard in Session 4 on the room's framing that this is simple, from prior lease-accounting experience — *"that one sentence is very deceiving"* — because closed-period changes cascade into reports, payment schedules and notification obligations. The job is settled; its cost is not.

### Keep a correction attached to the month it belongs to

> When I pay a producer for gas that flowed months ago, I need the correction to carry its original production month, so that it is priced at that month's rate rather than today's.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: handled correctly. Nora Whitfield: "If 10 units were reported with May production and it should have been 20, we are going to pay them for an additional 10 in whatever month we get that 10. That 10 stays here... because there could be pricing implications." A single payment run routinely settles the current month plus corrections reaching back three or four.

*Described by Nora Whitfield, 2026-08-03, and corroborated in a real payment file showing four production months settling in one accounting month.*

### Notice when a meter under contract is missing from a file

> When a gatherer's file arrives without a meter I know we have under contract, I need that absence flagged, so that we investigate instead of quietly paying nothing.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: known and handled by the people who do it. Nora Whitfield: "The zeros necessarily aren't reporting issues — it's more when it's not in the file and we have it." A reported zero is a fact. A missing row is a signal. Because Meridian never measures the gas itself, an absent row is often its only indication that something has gone wrong somewhere it cannot see.

*Described by Nora Whitfield, 2026-08-03. Not present in the scope pages, so worth confirming before it gets lost.*

### Send a statement package a producer can run their own accounts from

> When I send a producer their statement, I need it to include the detail their own accounting depends on, so that they can pay their royalty owners from it.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: a statement plus a spreadsheet, and the spreadsheet cannot change. Nora Whitfield: "We cannot change that." Around 680 companies run their own royalty accounting off that attachment, which makes its column layout a commitment to people outside Meridian.

*Described by Nora Whitfield, 2026-08-11. The spreadsheet's actual columns have never been specified and no source file has been seen.*

### Get a statement to the right person, and know it arrived

> When a statement goes out, I need it to reach the right contact and I need to know if it didn't, so that a producer isn't waiting on something that bounced two weeks ago.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: split between two people and two channels. Lucas Fennimore emails statements; Priya Castellan mails the paper ones. Recipient preferences are configured per counterparty in the contract system, and beyond that "each team member knows their customers' needs and preferences."

Not hypothetical: a producer wrote in during 2024 saying "I have not received the statement for July 2024 on the CGU. The ACH is being deposited today and have not received the production statement." Money arrived with no explanation attached.

*Derived from system documentation and one producer's email. Neither Lucas nor Priya has been asked about it.*

### Be able to run the cycle again next month without working it out again

> When I come back to a process I run once a month, I need a reliable record of how it goes, so that I am not reconstructing it from memory and neither is whoever covers for me.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: self-provided. Priya Castellan works from a personal "Roll Month Checklist" someone made for her, plus a cheat sheet telling her which producers have been renewed. No formal documentation exists, and nothing anywhere describes out-of-office cover or backup assignment.

*Derived from documentation of her personal files. Priya Castellan has never been asked about this.*

---

## Approval

⚠ **There are two gates, not one, and this section only knew about the later one until 2026-08-29.**

Every payment Meridian makes to a producer is approved by one person, **Desmond Falk**, a buyer on the acquired side, with **Nora Whitfield** as backup. **But before a payment exists, prices are approved** — a separate, earlier gate, in a different screen, and the observed approvers are different people.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Approve prices before they become money |  |  | as a working queue with a recorded decision. Harvest Ops's **Rate Console** is |
| Be confident enough to release millions of dollars |  |  | about twelve reports covering pricing, tiers, fees per pipeline and volumes. Seven of thos |
| Check the system against something the system didn't produce |  |  | his own spreadsheets. This is a legitimate control and standard four-eyes practice — check |
| Know what was signed off, by whom, and when |  |  | initials and dated send-and-return per pipeline, across all twenty-one pipeline rows of th |
<!-- /jobmap:scan -->

### Approve prices before they become money

> When the system has priced a month's volumes, I need to review what it produced and accept or reject it before it turns into charges and payments, so that a pricing error is caught while it is still cheap to fix.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: as a working queue with a recorded decision. Harvest Ops's **Rate Console** is two stacked panels — *Pending Volumes* on top, with a **Price Pending Volumes** action, and *Pending Price Advices* underneath with **Approve Price Advices** and **Cancel Price Advices**. Every price advice carries **`Approved By`** and **`Approval Date`**, and the historical records show them populated with domain accounts. Observed approvers include **Gus Halloran** and **Priya Castellan** — not Desmond Falk.

The advice being approved is not a small number. It carries contract volume, hedge volume, priced volume, hedge difference, over production, contract price, spot price, price difference, secondary price, fixed price amount, gain-loss amount, secondary amount, total amount and actual price.

**Two things about this matter more than the mechanic.** The pending queue also carries columns headed **`Agreement as of 6/1/2026`** and **`Vendor as of 6/1/2026`** — so part of what the approver is implicitly checking is that the system resolved the right effective-dated agreement and payee. And a price advice can be **cancelled**, which means there is a rejection path and a state this document does not describe.

*Derived from the running application, 2026-08-29. **Nobody has ever mentioned this gate in any session**, it appears in no scope page, and no estimate covers it. Who approves, against what, how often they reject and what happens next are all unknown. Given that Desmond Falk — the payment approver — has never been in a session either, **Meridian has now failed to talk to the owners of both of its approval gates.***

### Be confident enough to release millions of dollars

> When a payment run is ready, I need enough independent evidence that the numbers are right, so that I can authorise the money leaving with my name against it.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: about twelve reports covering pricing, tiers, fees per pipeline and volumes. Seven of those twelve compare the system's output against spreadsheets Des Falk maintains himself.

*Derived entirely from artifacts — the review workbook and the report inventory. Des Falk was invited to a scope session on 2026-08-03 and declined. Nobody has spoken to him.*

### Check the system against something the system didn't produce

> When I verify a payment run, I need a reference that came from somewhere other than the system I'm checking, so that an error inside it cannot confirm itself.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: his own spreadsheets. This is a legitimate control and standard four-eyes practice — checking a system against itself catches nothing. It is also undocumented and held by one person, and both of those things are true at once.

*Derived. Nobody has asked Des Falk why the spreadsheets exist — and whether they're a better route or a symptom of a system he doesn't trust decides two completely different designs.*

### Know what was signed off, by whom, and when

> When a question comes back about a payment weeks later, I need a record of who approved it and on what date, so that we can answer without reconstructing it.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: initials and dated send-and-return per pipeline, across all twenty-one pipeline rows of the review workbook. Notably, the system documentation describes the release step as being done by "whoever will hit the button to release payment" — the role is real and unnamed in writing.

*Derived from the review workbook and system documentation.*

---

## Contracting

**Nora Whitfield** and **Adele Winters** turn agreed deals into signed, binding paperwork and keep the underlying records straight. Nora also manages the payments team, and uses every application on the acquired side except the two nominations tools — wider access than anyone else in the business.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Check a deal against everything already signed before issuing anything binding |  |  | this is the formal division of authority. The buyer agrees the commercial terms; Contracti |
| Produce the documents all parties sign |  |  | from templates the documentation says are "owned by Contracting (Nora)." When a template ch |
| Get a confirmation through the approval gate |  |  | the buyer reviews the confirm, then sends it to a Middle Office group referred to only as |
| Know an uploaded deal is the final one |  |  | judgment. Nobody has described how the official version is recognised, and the scope pages |
| Keep track of a dispute that lives at three other companies |  |  | private spreadsheets. Around forty-four inquiries are tracked; some have been open more th |
| Make a change effective on the date it actually takes effect |  |  | possible on one side of the business and not the other. Nora Whitfield: "Today we can find o |
| Identify the wells behind a meter when it changes hands |  |  | manual reconciliation. Nora Whitfield: "The API numbers definitely are helpful because most |
| Keep working when a meter number means different things to different parties |  |  | by renumbering the meter to whatever makes the import work, and sometimes renumbering it b |
| Work at speed without reaching for the mouse |  |  | the current system was built for it. Nora Whitfield: "It's programmed to not need to use the |
<!-- /jobmap:scan -->

### Check a deal against everything already signed before issuing anything binding

> When a buyer submits a deal, I need to verify it against the master contract and existing confirmations first, so that we never issue a document that contradicts one we've already signed.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: this is the formal division of authority. The buyer agrees the commercial terms; Contracting verifies them and is the only role that produces documents parties sign. It is a checking relationship, which is why Nora Whitfield runs her own verification even when the system has already generated the paperwork.

*Derived from the September 2023 process and actor documentation, which describes roles rather than named people. Confirmed only in the sense that Nora's behaviour in sessions is consistent with it.*

### Produce the documents all parties sign

> When a deal is verified, I need to generate the confirmation and supporting paperwork in an approved form, so that everyone signs the same thing.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: from templates the documentation says are "owned by Contracting (Nora)." When a template changes, users run an executable to refresh their local copies, and someone sends a manual email telling them it happened.

*Derived from system documentation, 2023. Nora Whitfield has not been asked to confirm she still owns them.*

### Get a confirmation through the approval gate

> When a confirmation is ready, I need it reviewed and approved outside my own team, so that there is independent oversight before it becomes binding.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: the buyer reviews the confirm, then sends it to a Middle Office group referred to only as "PXT's team," who review, approve and send it back to Nora and the buyer. That function's system of record is email.

*Derived from process mapping documentation. No individual in that group has ever been named to us, and nobody from it has been in a session.*

### Know an uploaded deal is the final one

> When a signed deal sheet comes back, I need to be sure it's the official version before I build a confirmation on it, so that we don't paper a deal off a draft.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: judgment. Nobody has described how the official version is recognised, and the scope pages ask the same question.

*Derived from an open question in the scope pages. Nobody has been asked.*

### Keep track of a dispute that lives at three other companies

> When a producer tells me a volume is wrong, I need to track the case until it resolves, so that it doesn't get lost while it sits with people who don't work here.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: private spreadsheets. Around forty-four inquiries are tracked; some have been open more than a year. Resolution depends on a gatherer, a chart processor and a utility — none of whom Meridian can compel. As Gus Halloran put it: "It's usually between the chart processor and the producer, and then the chart processor and the utility. So we have no real say over it... it all falls to us."

*Described by Gus Halloran and Nora Whitfield, 2026-08-11, and corroborated by the trackers themselves. Nora and Priya discovered each other's tracker on 2026-08-10.*

### Make a change effective on the date it actually takes effect

> When I learn about a change that starts next month, I need to enter it now with its real effective date, so that nobody has to remember to do it later and no payment goes out against stale terms.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: possible on one side of the business and not the other. Nora Whitfield: "Today we can find out that someone's adding meters we're going to start buying production for in October. The last thing we want to do is wait until we've paid September to get that all set up." Two real financial errors trace to this gap — a producer charged twice because a contract extension was never marked as ending, and a payment released against a meter deletion that should have taken effect two months earlier, which the producer caught rather than Meridian.

*Described by Nora Whitfield and Gus Halloran, 2026-08-11, and evidenced by two documented defects.*

### Identify the wells behind a meter when it changes hands

> When a meter transfers to a new owner, I need the well identifiers the transfer paperwork uses, so that I can match their documents to our records without a round of back-and-forth.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: manual reconciliation. Nora Whitfield: "The API numbers definitely are helpful because most of the transfer documentation specifies API numbers, and then we have to do a bunch of back and forth." Meridian does not currently hold API numbers. In day-to-day conversation with a gatherer, people use well names instead — Bobcat, Alvear #1, Kestrel & Vance Holloway #2.

*Described by Nora Whitfield, 2026-08-11, unprompted. She asked for this explicitly, which makes it one of the few stated requests in the record.*

⚠ **Reframed 2026-08-29 — the well names are already arriving and nobody has to source them.** Every inbound volume row carries a populated **`Station`** column, and it flows through to the statement the producer receives: *MASTRANO #1 · SILVER CREEK ARSENAL #1 · WESTFIELD STATE UNIV #1 · HOLT, R.J. #1 · UNION CTY UNIV #4 · KOVALENKO LOUIS & BE*. **Harvest Ops also has a `Wells` column on the meter, empty on every row observed.** So the shape exists, the data exists, and they have never been connected. API numbers remain genuinely absent — the room struck sourcing them as a line item on 08-21, since *"we're not validating that they're correct... We're not going to Wyoming and going to look at every well"* — and Miles Ostrander's read is that they *"might literally only exist on like PDFs and scraps of paper and post-it notes."* **The job is unchanged. What changed is that half of it may already be solved by data we are throwing away.** *Derived, 2026-08-29.*

### Keep working when a meter number means different things to different parties

> When the number a gatherer uses for a meter doesn't match the number on our records or on this month's paperwork, I need to get the volumes matched and paid anyway, so that a naming disagreement doesn't hold up a payment.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: by renumbering the meter to whatever makes the import work, and sometimes renumbering it back the next day. Described in Session 2: *"they change their meter numbers in Atlas because depending on what thing is interfacing with a meter at some moment, they're just not consistently named... rather than fixing incoming information they just renumber the meter to fit whatever they're trying to do right now, do things, and then sometimes switch it back. And then next month they have to do it again."*

**This job exists because the room reframed a stated requirement into an achievement**, and the reframe is the most useful sentence in five sessions of transcript:

> *"I don't know that the ability to renumber meters is as important as making the system flexible against multiple interpretations of a meter number."*

The evidence that the underlying problem is real is in the data: Harvest Ops's meter numbers have no consistent format at all — `8074`, `P526`, `A782`, `733070`, `H722373`, `802263`, `L140`, `W803` — and one producer's two meters use two different conventions. Meter numbers were also settled in Session 3 as needing effective dates, because volumes arrive for a production month but import in a later accounting month, so matching a row requires knowing what the number was *then*.

*Described in Session 2, 2026-08-20, as a reframe rather than a request, with **Derived** support from the running application. ⚠ **The factual question underneath is open and nobody knows the answer:** did the meter number actually change, or did only this month's paperwork carry a different one? That is answerable by watching one import, and it decides whether this is a data-matching design or a records-management one.*

### Work at speed without reaching for the mouse

> When I'm entering or looking up data all day, I need to move through the system by keyboard, so that my hands stay where the work is.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: the current system was built for it. Nora Whitfield: "It's programmed to not need to use the mouse for data entry purposes... to have both would be terrific." Evan Marsh, describing watching her: "She's magically on different screens, and it's because she has the ability to click a bunch of keyboard shortcuts to get there." Priya Castellan says the same holds on Gus's system.

*Described by three people, 2026-08-11. How much time it actually saves has never been measured, and that number decides how much it is worth building.*

⚠ **Narrowed 2026-08-29 — this job belongs to Atlas, and possibly only to Atlas.** All three accounts point at the acquired side: Nora Whitfield describing her own system, Evan Marsh describing watching her, Priya Castellan saying the same holds on Gus's. **Harvest Ops shows no keyboard affordances at all** across 45 screens — no function-key legend, no underlined accelerators, no shortcut hints. It is a mouse-driven Windows application with a ribbon, Back/Next paging and icon toolbars. Either Gus Halloran drives it by keyboard regardless and the software simply doesn't advertise it, or this job is smaller than three people's accounts suggest. **Owen Petrakis's question — the one open since Session 1, "it's important for Coleman to see what you're coming from" — is therefore still unanswered, because the system it is about has not been seen.** *Derived, 2026-08-29.*

---

## Buying

**Gus Halloran** is a Buyer for Rockies Supply and runs the original Meridian system. **Desmond Falk** buys on the acquired side. **Victor Lansing** appears in the access records as a third buyer and in no process description anywhere.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Turn a verbal agreement into a system commitment |  |  | the buyer enters a reservation, Contracting converts it to a confirmation. Changes to a li |
| Get a deal papered without chasing it |  |  | not tracked in any system. Whether deal sheets launched and never uploaded should be follo |
| Avoid paying the wrong party when a meter changes owner |  |  | awkward on the original Meridian system. Gus Halloran has to wait until a meter finishes paying it |
| Work a renewal list to closure, not just see it |  |  | **Harvest Ops's Renewal Board screen already is this dashboard.** It fil |
| Keep working knowledge of producers available to more than four people |  |  | it lives in people. Gus Halloran: "It's just Des and I and Nora and Priya that are talking to |
<!-- /jobmap:scan -->

### Turn a verbal agreement into a system commitment

> When I've agreed terms with a producer, I need to record the expected volumes, pricing and contract terms straight away, so that Contracting can verify and paper it.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: the buyer enters a reservation, Contracting converts it to a confirmation. Changes to a live deal go back through the buyer as an amendment, and Contracting does the data entry.

*Derived from the September 2023 process documentation.*

### Get a deal papered without chasing it

> When I've launched a deal sheet, I need to know whether it came back, so that a deal doesn't sit half-finished without anyone noticing.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: not tracked in any system. Whether deal sheets launched and never uploaded should be followed is an open question in the scope, which suggests somebody currently keeps it in their head.

*Derived from an open scope question. Nobody has been asked.*

### Avoid paying the wrong party when a meter changes owner

> When a meter is sold mid-cycle, I need the ownership change to take effect on the right date, so that each party is paid for the gas that was theirs.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: awkward on the original Meridian system. Gus Halloran has to wait until a meter finishes paying its current owner before he can reassign it, and hold the change in his head until then. Nora Whitfield: "In poor Gus's world, he has to collect everything and remember, after this is paid, now I can make these changes."

*Described by Gus Halloran and Nora Whitfield, 2026-08-11.*

### Work a renewal list to closure, not just see it

> When contracts approach their end date, I need to see them early enough to act, track which producers I have already approached, and know which have been renewed, so that nothing lapses and I am not calling the same person twice.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

⚠ **Corrected 2026-08-29. The job as written was passive — "see which contracts are coming up" — and the incumbent is doing considerably more than that.**

Today: **Harvest Ops's Renewal Board screen already is this dashboard.** It filters by minimum and maximum expiration month and by gatherer, sorts by expiration date, exports to Excel, and carries per row: producer, gatherer, agreement, representative, **notification date**, expiration date, annual Dth, annual Mcf, contract basis, price type, index, NYMEX, offer price, **`Subsequent Term Established`** as true/false, **a `Notified` checkbox**, and margin.

**So the achievement is not visibility — it is working a list to closure.** Notification is tracked, renewal outcome is tracked, and the commercial terms sit on the same row so the person working it can see what they are renewing against. The dashboard being "in scope" was accurate; it being absent was not.

*Described by Neil Abernathy, 2026-07-30 — the sponsor, not a buyer — with **Derived** correction from the running application. ⚠ **Neil Abernathy left on 2026-08-21 and this capability now has no business advocate**, which is a poor reason to lose a working feature. Gus Halloran said on 08-11 that prospect tracking isn't needed; **that is a different question from contract renewal**, and the two have been carried together in the record. Nobody has asked Gus Halloran whether he uses this screen, and he runs the system it lives in.*

### Keep working knowledge of producers available to more than four people

> When a producer calls, I need to know their history and who they are without depending on one person's memory, so that any of us can pick up the conversation.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: it lives in people. Gus Halloran: "It's just Des and I and Nora and Priya that are talking to the producers." Nora Whitfield named the goal directly: "We kind of already know who belongs with what companies, but that's the institutional knowledge that we are trying to give to everyone else."

*Described by Nora Whitfield and Gus Halloran, 2026-08-11.*

---

## Scheduling

**Roselyn Aitken** is a Gas Supply Analyst. **Walt Ferris** and **Corwin Delacroix** work alongside her. They are the only users of the nominations tools, and none of them has been in a session or spoken to.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Commit daily volumes to each pipeline in advance |  |  | two tools, calculated from production history, producing a daily spreadsheet by geography. |
| Work out which producers sit inside an affected area |  |  | by points of delivery and by bubbles — clusters of meters on a gathering system. |
| Tell producers when a pipeline tells us to cut back |  |  | by hand. The documentation is blunt: "The GENERATE EMAIL functionality is currently NOT us |
<!-- /jobmap:scan -->

### Commit daily volumes to each pipeline in advance

> When a delivery month approaches, I need to tell each pipeline how much gas we will put into it each day, so that they can balance their system and we meet our commitments.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: two tools, calculated from production history, producing a daily spreadsheet by geography. Between the two calculation steps there is a manual save, close and re-upload. How the finished nomination actually reaches the pipeline is documented nowhere.

*Derived from 2023–24 system documentation. Nobody in Scheduling has been asked anything.*

### Work out which producers sit inside an affected area

> When something happens on part of a gathering system, I need to identify which of our producers are inside that area, so that I can act on the right ones.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: by points of delivery and by bubbles — clusters of meters on a gathering system.

*Derived from system documentation.*

### Tell producers when a pipeline tells us to cut back

> When a pipeline or gatherer restricts how much gas can go in, I need to notify the producers affected, so that they stop or reduce production and we adjust what we've promised.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: by hand. The documentation is blunt: "The GENERATE EMAIL functionality is currently NOT used. Users use the Extract Data functionality and then manually email the Producers." Roselyn Aitken maintains the producer field-contact email addresses those notices go to, in her own spreadsheets. A shut-in also flows into money — a producer who has been cut back produces less, and if they hold a fixed-price agreement someone calculates the shortfall by hand.

*Derived from system documentation. The email addresses living in one person's spreadsheet is the kind of detail that only surfaces by asking.*

---

## Supply

Supply carries Meridian's market position. Producer deals feed it, and today that connection runs through a dashboard this project will retire.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Know when a new producer deal lands |  |  | through the Horizon Dashboard. Acquired-side deals flow straight into the trading system; Meridian |
| Report the physical position without pulling data from outside |  |  | dependent on external data. |
<!-- /jobmap:scan -->

### Know when a new producer deal lands

> When a producer deal is agreed, I need to know about it without anyone telling me, so that our position reflects gas we've actually committed to buy.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: through the Horizon Dashboard. Acquired-side deals flow straight into the trading system; Meridian-side deals load in aggregate through a separate task and then into spreadsheets by query.

*Derived from the scope pages. Nobody in Supply has been asked what they actually need.*

### Report the physical position without pulling data from outside

> When I report our physical position, I need the producer data to come from our own systems, so that I'm not dependent on data sourced externally.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: dependent on external data.

*Derived from the scope pages, which name **Des Wrenfield** as the person this serves. He has never been contacted.*

---

## Finance, Accounts Payable and financial oversight

**Evan Corbin** is an Energy Settlements Analyst and owns the step where producer payments leave the operating systems and enter accounting. **Denise Vachon** is a Senior Accounts Payable Specialist. Several other named people in Accounting and AP touch producer payments downstream.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Know what we are going to owe before the month closes |  |  | there is a screen for it. Harvest Ops's **Estimated Grower Payments** takes an e |
| Get the numbers into the general ledger and out to the banks |  |  | Evan Corbin clicks a button in the original Meridian system that produces a file, and upload |
| Prove what we sent matches what the ledger recorded |  |  | at least partly manual. Where a payment run doesn't match the producer file — rounding dif |
| Get a new payee set up before a payment can go out |  |  | a coordination process with Accounts Payable. Whether it blocks the export is an open ques |
| Review and approve transactions independently of the operating team |  |  | the function exists, is referred to as "PXT's team," and its system of record is email. |
| File state taxes on time |  |  | quarterly, handled inside the payments team — Renata Okafor completes the Colorado online form |
| Produce the FERC filing |  |  | unknown. FERC filing is named in scope and the question of who produces it today is open, |
| Know the cost of the gas we bought |  |  | a report Finance depends on. What it needs to show and who consumes it are both open quest |
<!-- /jobmap:scan -->

### Know what we are going to owe before the month closes

> When an expense month is still open, I need a projection of what producers will be owed, so that the number is not a surprise when the cycle runs.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: there is a screen for it. Harvest Ops's **Estimated Grower Payments** takes an expense month and a gatherer, offers three filters — *Do Not Show Fixed Agreements · Do Not Show Variable Agreements · Only View New Agreements this ExpenseMonth* — and returns one row per meter per agreement carrying contract volume, hedge volume, vendor, pricing type, index name, index price, index multiplier, NYMEX, contract basis, markdown, pre-delivery costs, contract BTU, agreement start and end dates, and `IsNewContractInExpenseMonth`.

⚠ **Two things stand out.** The *Only View New Agreements this ExpenseMonth* filter implies somebody is specifically watching what has just come on — which is a different job from forecasting the total. And this is the one screen in the application whose column headers are raw database names rendered without spaces, with unformatted datetimes. **It reads as a data extract someone needed badly enough to ship as-is**, which usually means a real recurring question and no time to design an answer for it.

*Derived from the running application, 2026-08-29. **Placed in this section provisionally.** It could equally belong to Buying, to Supply, or to the payments team. The Scope of Work does not mention estimation at all, and the object map carried Estimated Volume under "possibly missing" until today. Who asks this question, when, and what they do with the answer is entirely unknown.*

### Get the numbers into the general ledger and out to the banks

> When a payment run is released, I need it to arrive in the accounting system in the right form, so that the books are accurate and the money actually goes out.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: Evan Corbin clicks a button in the original Meridian system that produces a file, and uploads it to Silverline Ledger. That is the only documented path from either system into accounting. Silverline Ledger then instructs the banks to issue cheques and ACH transfers. AP's role boundary is stated plainly by Denise Vachon: "These are not sent out by AP. I only send the payments."

*Derived from system documentation and support tickets. Evan Corbin has never been in a session.*

### Prove what we sent matches what the ledger recorded

> When an export has run, I need to tie out what went across against what the ledger actually took, so that nothing is silently missing or duplicated.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: at least partly manual. Where a payment run doesn't match the producer file — rounding differences, typically — someone reconciles line by line.

*Derived from support tickets. Whether this is a system function or a person's job is an open question in the scope pages.*

### Get a new payee set up before a payment can go out

> When we're about to pay someone new, I need them established as a vendor in the accounting system first, so that the payment doesn't fail at the last step.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: a coordination process with Accounts Payable. Whether it blocks the export is an open question, which suggests it sometimes does.

*Derived from the scope pages.*

### Review and approve transactions independently of the operating team

> When a transaction needs a second set of eyes outside the team that created it, I need to review and approve it, so that there is independent oversight of money moving.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: the function exists, is referred to as "PXT's team," and its system of record is email.

*Derived from 2023 process documentation. No individual has been named and nobody from the function has been in a session.*

### File state taxes on time

> When a filing period closes, I need the tax figures the filing depends on, so that Colorado and Texas returns go in on time and correct.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: quarterly, handled inside the payments team — Renata Okafor completes the Colorado online form. Tax rates are held in spreadsheets rather than as system reference data.

*Derived from the report inventory and system documentation.*

### Produce the FERC filing

> When the filing is due, I need to produce what the regulator requires, so that Meridian stays compliant.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: unknown. FERC filing is named in scope and the question of who produces it today is open, which means nobody on the project currently knows.

*Derived from an open scope question. This is a compliance obligation with no identified owner.*

### Know the cost of the gas we bought

> When I close the books, I need historical volume and payment data at the right grain, so that cost of goods sold is right.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: a report Finance depends on. What it needs to show and who consumes it are both open questions.

*Derived from the scope pages.*

---

## Producers

Producers never log into anything Meridian builds. Around 680 companies experience this system entirely through a statement and the spreadsheet attached to it.

<!-- jobmap:scan -->
| Job | Who | Sign-off | Today |
| --- | --- | --- | --- |
| Understand what I was paid and why |  |  | a statement per pipeline and gathering system combination, per payee. A producer with gas |
| Pay my own royalty owners from what Meridian sends |  |  | the spreadsheet attached to the statement. It is a working interface into other companies' |
| Get a wrong volume put right |  |  | slowly, through parties Meridian cannot compel. The correction eventually arrives on a future p |
| Know a payment is coming and what it covers |  |  |  |
<!-- /jobmap:scan -->

### Understand what I was paid and why

> When a payment arrives, I need to see how it was calculated, so that I can check it against my own expectations without ringing anyone.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: a statement per pipeline and gathering system combination, per payee. A producer with gas on several systems can receive many. Gus Halloran's analogy: "If you have six different jobs, those six paychecks are all coming from different things, have different deductions."

*Described by Nora Whitfield and Gus Halloran, 2026-08-11 — from the Meridian side. No producer has ever been asked.*

### Pay my own royalty owners from what Meridian sends

> When I receive a statement, I need the underlying detail in a form I can work with, so that I can pay the people who own royalties on my wells.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: the spreadsheet attached to the statement. It is a working interface into other companies' accounting, which is why its shape cannot change casually.

*Described by Nora Whitfield, 2026-08-11. Never verified with anyone who actually uses it.*

### Get a wrong volume put right

> When my production is reported wrong, I need it corrected and paid, so that I receive what I'm owed.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: slowly, through parties Meridian cannot compel. The correction eventually arrives on a future payment, tagged to the month it belonged to.

*Derived from the inquiry trackers.*

### Know a payment is coming and what it covers

> When money lands in my account, I need the statement that explains it, so that I know what I've been paid for.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

One producer wrote in: "I have not received the statement for July 2024 on the CGU. The ACH is being deposited today and have not received the production statement."

*Derived from a single producer email found in a support ticket. This is the only direct producer voice anywhere in the record.*

---

## Data consumers — Supply, Finance, Accounts Payable and Risk

### Get to producer data without asking someone to run a report

> When I need producer information for a decision, I need to get it directly, so that I'm not waiting on someone else's queue.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: through requests to the Producer Services team. Self-service access for these four groups is one of the project's stated outcomes.

*Derived from the scope pages, which ask "who are the named consumers in Supply, Finance, Accounts Payable and Risk, and what does each need?" That question is still open.*

---

## Running the system day to day

### Know what is waiting for me today, across every producer

> When work is queued against individual producers and meters, I need one list of what is mine to do right now regardless of which producer it sits under, so that I am not opening records one at a time to find out.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: it does not exist, and the gap was named unprompted in Session 1: **"They don't know which producer has an action item they need to do today. They need an overarching list that's separate."**

**The finding that survives regardless of how it gets built is that there have to be two views** — the entity's own list, and the user's list across all producers. Precedents named in the room were Fieldwork Toolkit signals and SFRs, which flow over to OPX, and whatever Beacon recently built.

Part of the purpose is coordination rather than recall — *"so two people aren't working on fixing a meter issue."* Around forty-four meter inquiries are open today, some for more than a year, tracked in three private spreadsheets that Nora Whitfield and Priya Castellan each keep separately. **They asked for tracking and explicitly not workflow.**

*Described in Session 1, 2026-08-19, and called **"a requirement nobody wrote down."** ⚠ **Whether this is self-tracking or a managed work queue with assignment and follow-up dates is unresolved, and it is the difference between a two-day build and a full iteration.** Nobody has watched anyone work a to-do list, and the people who keep the three spreadsheets have not been asked what is in them.*

### Know a business process finished, and chase it when it didn't

> When a volume import, payment run, statement job or export runs, I need to know whether it completed, so that a silent failure doesn't surface as a missed payment.

| Who | Depends on | Frequency | Duration | Sign-off |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Today: not described anywhere. When something breaks in the spreadsheets, Priya and Renata escalate to Owen Petrakis in IT.

*Derived from support tickets and an open scope question about who resolves which error types.*

---

## How this document stays current

**Jobs are stable; the notes under them are not.** A job like "correct an error without reopening a settled month" will still be true in five years. The paragraph describing how it happens today will be wrong within one. When something changes, expect to edit the "Today" note and leave the job alone.

**Update the confidence line in the same session where you learn something.** The line is the point of the document. A job marked Derived and a job marked Confirmed look identical without it, and treating them the same is how a guess becomes a requirement.

**Move jobs from Described to Confirmed by reading them back.** Show someone the three or four jobs that belong to them and ask what's wrong. Corrections are the most valuable thing this document can receive, and a job rewritten by the person who does it is the best possible outcome.

**Mine open questions for new jobs.** Several jobs here came from scope questions rather than from anyone describing their work — where a document asks "who does this?" or "who is notified?", somebody is doing it today and hasn't been asked.

**What can't be filled in from a desk:** how long each job takes and how often it happens. Without those two numbers this list says what matters but not what matters most, and they can only be captured by watching the work.

**A capability in the running software is a job nobody wrote down.** Seven of the eight jobs added on 2026-08-29 came from looking at Harvest Ops rather than from anyone describing their work. Somebody built each of those screens because somebody asked for them. **Where the incumbent has a feature this document cannot explain, that is a job with a missing owner — go find who asked.**

**Coverage as of 2026-08-29:** Producer Payments, Contracting and Buying rest on people describing their own work in recorded sessions, now supplemented by direct observation of one of the two systems. Scheduling, Supply, Finance, financial oversight and producers still rest on documentation and colleagues' accounts. **Nobody in those five groups has been spoken to, and that has not changed since 2026-08-16.**

⚠ **Both approval gates are unowned in this record.** Desmond Falk approves every payment Meridian makes and has never been in a session — he was invited once and declined. The price-approval gate discovered on 2026-08-29 has never been mentioned by anyone. **The two people who say yes before money moves are the two people nobody has talked to.**

⚠ **Atlas is unexamined.** This pass covered Harvest Ops, which holds 425 of 680+ producers. Expect Atlas to add jobs in Contracting and Buying particularly, and to settle the keyboard question that three people have described and no one has demonstrated.
