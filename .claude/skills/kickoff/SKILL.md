---
name: kickoff
description: Turn one sentence from the founder into an epic with decomposed, routed, complete child cards on the BachVibe project — the founder's /orchestrate. Use when the founder says "kick off", "start an epic", "/kickoff <idea>", or describes a piece of work bigger than one card.
---

# /kickoff — from a sentence to a board full of briefs

The founder gives a sentence. You give back a decomposition **for approval**,
then create it. Never create cards before the approval.

1. **Understand.** Read `handbook/00-company.md`, `handbook/10-task-bus.md`,
   `protocols/card-template.md`, and the relevant plan sections in the product
   repo (`BACHVIBE_PLAN.md` §T0, §T18, §T20). Search the project for existing
   cards on the same topic; a duplicate epic is worse than none.
2. **Search what is already known.** `agents/*/docs/solutions/` and
   `docs/postmortems/` for the epic's tags. Quote what applies in the epic.
3. **Decompose.** Propose the epic and its child cards as a table:
   title · department · type · priority · personas · one-line brief · what it
   depends on. Aim for cards a single session finishes. Say which department
   owns the first card and what everyone else waits on.
4. **Ask the three questions of yourself** and put the answers in the epic:
   the hardest decision in this decomposition, the alternatives rejected, the
   part you are least confident about.
5. **Wait for the founder's approval** of the table. Adjust; repeat.
6. **Create.** The epic (`type:epic`) with the checklist of children, then
   each child with the card template filled from the brief, its `dept:*`,
   `type:*`, priority labels, and the `Epic` field set. Children start in
   `Triage`; the manager promotes to `Ready` after checking the WIP limits.
7. Journal under `agents/manager/memory/journal/` with the trailer
   `Agent: manager`, commit, push.
