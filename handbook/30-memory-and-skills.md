# 30 — Memory, skills, and what gets committed

A session is disposable. Every Routine starts a fresh one, and the only thing
that carries over is what the previous session wrote to this repository. So
every agent's loop ends the same way: **write memory, commit, push, then end**.

## Where things live

```
agents/<dept>/
├── CLAUDE.md             Auto-loaded (mounted as CLAUDE.local.md). The
│                         reading order and the folder's stage. See §60.
├── memory/MEMORY.md      ≤ 200 lines. Facts that stay true: URLs, ids, who
│                         owns what, decisions taken, gotchas that bit us.
│                         Rewritten in place; keep it current, not complete.
├── memory/journal/       YYYY-MM-DD.md, append-only. What was done today,
│                         what was learned, what is half-finished. Never
│                         edited after the day; the standup reads them.
├── .claude/skills/<name>/SKILL.md   A procedure the agent found itself
│                         repeating. Standard Agent Skills format; mounted
│                         into ~/.claude/skills/ so the session has it by name.
├── .claude/agents/<name>.md   Sub-agents: reviewers, personas, specialists.
│                         Mounted into ~/.claude/agents/.
└── docs/
    ├── solutions/        one file per solved problem (protocols/solution-template.md)
    ├── runbooks/         procedures from real incidents (protocols/runbook-template.md)
    ├── postmortems/      every P0, stall, wrong action (protocols/postmortem-template.md)
    └── plans/            plans for the cards this agent owns
```

The docs categories are not filing; they are the **Compound** step of every
card (§60.4). A session that solved something and wrote no solution file
has not finished.

## The loop every agent runs

1. `git pull --rebase` on `main` of `bachvibe-hq`.
2. Read `handbook/`, your `AGENT.md`, your `MEMORY.md`, today's and yesterday's
   journal. Load skills listed in `AGENT.md`.
3. Read your board column (`Ready` and `In Progress` for your department;
   plus any card labelled `needs:<dept>`).
4. Work one card at a time. Comment when you take it, comment when you leave it.
5. Before ending, **compound**: a solved problem → `docs/solutions/`; a
   procedure run twice → a skill; a P0 or a wrong action → `docs/postmortems/`;
   a pattern that will recur → a PR promoting it to `CLAUDE.md`/`AGENT.md`.
   Then append to today's journal; update `MEMORY.md` if a fact changed;
   commit and push.
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

A skill useful to more than one department is proposed as a PR into the HQ
root's `.claude/skills/` (where `/hey` and `/kickoff` live); the manager
reviews.

## Installed skills: the registry, the lockfile, the review

Each folder also carries skills from the public registry at skills.sh,
installed with Vercel's `skills` CLI and pinned in that folder's
`skills-lock.json` — the same mechanism the product repo uses. From inside
`agents/<dept>/`:

```bash
npx skills find "<topic>"                          # search
npx skills add <owner/repo> -s <name> -s <name> -a claude-code -y
npx skills update                                  # bump the pinned versions
```

Three rules, because an installed skill runs with the agent's permissions:

- **Read it before it runs.** Whoever installs a skill (an agent, by PR; the
  founder, directly) reads every file in it and scans for anything that
  fetches a URL, reads a credential, or tells the agent to disregard its
  instructions. The install of 2026-09-25 was scanned that way; the record
  is in the commit that added them.
- **The handbook wins.** A registry skill that assumes a different board,
  workflow or voice is used for its craft, not its process — `project-board`
  audits our fields, it does not redesign them; `pricing` writes the page,
  §T0 sets the price.
- **An agent installs by PR, never in its Routine's loop.** A skill is a
  standing change to what the folder can do; the founder sees it land.
The lists of what each folder carries and why are in each `AGENT.md`.

## What memory is not

- Not a copy of a card. The card is on GitHub.
- Not customer data. No names, emails, or ticket bodies in this repository;
  refer to the ticket by link. This repo is private but it is not a database.
- Not a secret. Never. `memory-guard` also runs a secret scan.
