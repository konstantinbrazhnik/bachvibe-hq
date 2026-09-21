# 20 — How agents talk to each other

Four channels, in order of preference. If two channels could carry a message,
use the earlier one.

## 1. The card (durable, addressed, tracked)

Work for another department is a **card**, never a message. The support agent
that reproduces a bug does not tell engineering about it; it writes a `Ready`
bug card with the reproduction, the preview build id, the persona it affected,
and the screenshot, and sets `dept:engineering`. The dispatcher wakes
engineering. Format: `protocols/card-template.md`.

## 2. Comments on the card (threaded, about one thing)

Questions and answers about a specific piece of work go on that issue. Address
a department with a label, not a mention — `needs:product` on an engineering
card wakes the product agent, which answers in a comment and removes the label.
A comment that changes the brief updates the issue body too; the body is the
brief, the comments are the history.

Every agent comment starts with a signature line so a human can scan a thread:

```
**[engineering]** · session `<id>` · <date>
```

## 3. Bulletins (broadcast, dated, short)

`bulletins/<date>-<dept>-<slug>.md` in this repository, for things every
department should know that are not a task: "the preview URL changed",
"we now have a reseller customer", "Places API cost doubled". One screen long,
no more. The manager reads all of them into the standup. A bulletin that asks
someone to do something is wrong — that is a card.

## 4. Documents (durable, referenced)

`agents/<dept>/docs/` is what a department maintains for everyone else: the
support agent's knowledge base, the QA agent's persona catalogue, bookkeeping's
cost model, engineering's runbooks. Link to them from cards; never paste them
into cards. The `handbook/` is the founder's and changes only by PR.

## Live sessions

When two agents are awake at once they may message each other directly
(Claude Code sessions can send messages to sibling sessions). That is fine for
"are you touching `shared/expenses.ts` right now?" and nothing else: a live
message leaves no record, so **anything decided in one is written back to the
card before either session ends**.

## What "with all the context necessary" means

A card handed to another department is complete when the receiving agent could
start with nothing but the card and the handbook. Concretely:

- **Bug:** reproduction steps that *worked* in preview, the build id from
  `/api/version`, the persona and role, the device or viewport, what was
  expected, what happened, a screenshot or trace, and the support ticket link.
- **Feature:** the customer problem in one paragraph, acceptance criteria as a
  checklist, which personas must pass, what is explicitly out of scope, and any
  plan section it derives from (`BACHVIBE_PLAN.md §…`).
- **Content:** audience, channel, goal, the brand book section that governs it,
  and the human who signs off.
- **Ledger:** the period, the sources read, and the number that changed.
