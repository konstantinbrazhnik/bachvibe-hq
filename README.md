# BachVibe HQ — the company that runs itself

**`konstantinbrazhnik/bachvibe-hq`** is one
repository that holds every agent in the BachVibe organisation, the handbook
they all operate under, the memory and skills each of them accumulates, and the
small Cloudflare Worker that turns GitHub events into work.

It was scaffolded inside `Daren-bach` (pull request #77 there) and split out
with `scripts/split-out.sh` on 2026-09-25; this repository is now the only
place it is edited. The proposal it implements, including the reasoning
behind "one HQ repo, product code elsewhere", is
[`AGENT_ORG_PLAN.md` in Daren-bach](https://github.com/konstantinbrazhnik/Daren-bach/blob/preview/AGENT_ORG_PLAN.md).

## Layout

```
hq/
├── CLAUDE.md            the root context: which agent you are, the four rules
├── .claude/skills/      the founder's skills: /hey (briefing), /kickoff (epic → cards)
├── handbook/            what every agent reads before it does anything
│   ├── 00-company.md         mission, departments, what a human must approve
│   ├── 10-task-bus.md        the GitHub Project: fields, columns, labels, handoffs
│   ├── 20-communication.md   how agents talk: cards, comments, bulletins, docs
│   ├── 30-memory-and-skills.md   what gets remembered, where, and how it is committed
│   ├── 40-environments.md    one Claude Code environment per department, and Cloudflare
│   ├── 50-definition-of-done.md  per-department exit criteria
│   ├── 60-folder-and-compounding.md  the folder is the agent; trust stages; compound step
│   └── brand/BRAND.md        the seed the marketing agent grows into a brand book
├── protocols/           fill-in templates the handbook refers to
├── agents/<dept>/       one folder per agent — see "Anatomy of an agent"
├── dispatch/            Cloudflare Worker: GitHub webhook → route, label, wake
├── scripts/             bootstrap the GitHub side, split this folder out
└── .github/             CODEOWNERS, memory-guard workflow, issue forms
```

## Anatomy of an agent

```
agents/support/
├── CLAUDE.md         auto-loaded: reading order and the folder's trust stage
├── AGENT.md          who it is, what it owns, what it may never do, its loop
├── ROUTINE.md        the short prompt its Routine fires with (fresh session each time)
├── .claude/
│   ├── agents/           sub-agents: reviewers, personas, specialists
│   └── skills/           Agent Skills the agent wrote for itself
├── memory/
│   ├── MEMORY.md         curated, short, always loaded — facts that stay true
│   └── journal/          one file per working day, append-only, never rewritten
└── docs/
    ├── solutions/        one file per solved problem, tagged for retrieval
    ├── runbooks/         procedures from real incidents
    ├── postmortems/      every P0, stall, wrong action
    └── plans/            plans for the cards this agent owns
```

The folder is the agent: `scripts/mount-agent.sh` makes it the session's
project, so nothing has to be re-explained (`handbook/60-folder-and-compounding.md`).

An agent **owns its own folder and nothing else in this repo**. It may commit
there directly to `main`; everything outside it goes through a pull request the
manager agent reviews. `.github/workflows/memory-guard.yml` enforces that.

## The two rules that make this work

1. **The board is the only source of work.** Nothing happens because an agent
   felt like it. Every action traces to a card on the project, and every card
   was put there by a person, the dispatcher, or another agent with a reason
   written on it.
2. **If it is not in git, it did not happen.** A finding lives in a journal, a
   decision in a doc, a reusable procedure in a skill. Sessions are disposable;
   the repository is the company's memory.
3. **Build it, use it, trust it, then orchestrate it.** No folder gets a
   Routine before the founder has run it by hand until it is predictable, and
   no folder gets dispatcher fires before its heartbeat has run supervised.
