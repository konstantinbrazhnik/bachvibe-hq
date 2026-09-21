# 30 — Memory, skills, and what gets committed

A session is disposable. Every Routine starts a fresh one, and the only thing
that carries over is what the previous session wrote to this repository. So
every agent's loop ends the same way: **write memory, commit, push, then end**.

## Where things live

```
agents/<dept>/
├── memory/MEMORY.md      ≤ 200 lines. Facts that stay true: URLs, ids, who
│                         owns what, decisions taken, gotchas that bit us.
│                         Rewritten in place; keep it current, not complete.
├── memory/journal/       YYYY-MM-DD.md, append-only. What was done today,
│                         what was learned, what is half-finished. Never
│                         edited after the day; the standup reads them.
├── skills/<name>/SKILL.md   A procedure the agent found itself repeating.
│                         Standard Agent Skills format (frontmatter with
│                         `name` and `description`, then instructions).
└── docs/                 What the department maintains for the company.
```

## The loop every agent runs

1. `git pull --rebase` on `main` of `bachvibe-hq`.
2. Read `handbook/`, your `AGENT.md`, your `MEMORY.md`, today's and yesterday's
   journal. Load skills listed in `AGENT.md`.
3. Read your board column (`Ready` and `In Progress` for your department;
   plus any card labelled `needs:<dept>`).
4. Work one card at a time. Comment when you take it, comment when you leave it.
5. Before ending: append to today's journal; update `MEMORY.md` if a fact
   changed; if you repeated a procedure, write it as a skill; commit and push.
6. End the session. Do not poll, do not sleep, do not wait for a reply.

## Commit rules

- An agent commits **directly to `main`** for anything under its own
  `agents/<dept>/` and under `bulletins/`. Directories are disjoint, so a
  `git pull --rebase` before push never conflicts. Message format:
  `<dept>: <what changed>`.
- Anything outside those paths is a PR reviewed by the manager agent, and
  anything under `handbook/` is a PR the founder merges.
- `.github/workflows/memory-guard.yml` fails a push to `main` that touches
  paths outside the committing agent's own directory. The committing agent is
  read from the commit trailer `Agent: <dept>`, which every agent adds.

## Skills: when to write one

Write a skill the **second** time you do something, not the first, and not
the fifth. A skill is a procedure with a trigger, not a diary. Good skills
this company will grow: "reproduce a bug against preview with impersonation",
"run the organizer + attendee persona pair on a PR preview", "close the month
from the merchant-of-record export", "publish a site change to the staging
domain". Each has a `description` that says *when* to load it, because the
agent picks skills by description.

A skill useful to more than one department is proposed as a PR into
`handbook/skills/`; the manager reviews.

## What memory is not

- Not a copy of a card. The card is on GitHub.
- Not customer data. No names, emails, or ticket bodies in this repository;
  refer to the ticket by link. This repo is private but it is not a database.
- Not a secret. Never. `memory-guard` also runs a secret scan.
