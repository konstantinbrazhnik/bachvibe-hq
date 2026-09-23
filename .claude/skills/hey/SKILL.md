---
name: hey
description: The founder's morning briefing across every department — what finished, what errored or stalled, what is blocked and on whom, every needs:human card with its recommendation, P0s. Use when the founder asks "what's going on", "morning briefing", "/hey", or opens a session to catch up.
---

# /hey — the briefing

Produce one screen. Read, in this order, and do not skip a source:

1. `bulletins/standup-<today>.md` and `<yesterday>.md` if they exist.
2. Every `agents/<dept>/memory/journal/<today>.md` and `<yesterday>.md`.
3. The GitHub Project "BachVibe" (number in `agents/manager/memory/MEMORY.md`):
   cards with `needs:human`, `P0`, `blocked`, and anything `In Progress` with
   no comment in 48 hours.
4. `GET <dispatcher>/runs` (URL and token in the manager's MEMORY.md) for the
   last 24 hours of fires, compared against journal entries: a fire with no
   journal within two hours is a stall.
5. Open PRs in the product repos with a red check or a review waiting on an
   agent.

Write it as:

```
## Done since yesterday          (one line per card, department in brackets)
## Needs you                     (each needs:human card: title, the recommendation, one-line why)
## Errors and stalls             (fires with no journal; red PRs; sessions that ended without a journal)
## Blocked                       (card → on whom → since when)
## P0
## Money                         (bookkeeping's last cost line, if newer than a week)
```

No section may say "see above". If a section is empty, say "none". Do not
take any action from this skill; it reads. If the founder then asks for an
action, that is a card.
