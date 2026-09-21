# BachVibe HQ — the company that runs itself

This directory is the scaffold for **`konstantinbrazhnik/bachvibe-hq`**: one
repository that holds every agent in the BachVibe organisation, the handbook
they all operate under, the memory and skills each of them accumulates, and the
small Cloudflare Worker that turns GitHub events into work.

It lives inside `Daren-bach` only so it can be reviewed as one pull request.
Once approved it is split out into its own repository with
[`scripts/split-out.sh`](scripts/split-out.sh) and never edited here again.
The reasoning behind "one HQ repo, product code elsewhere" is in
[`../AGENT_ORG_PLAN.md`](../AGENT_ORG_PLAN.md) §3.

## Layout

```
hq/
├── handbook/            what every agent reads before it does anything
│   ├── 00-company.md         mission, departments, what a human must approve
│   ├── 10-task-bus.md        the GitHub Project: fields, columns, labels, handoffs
│   ├── 20-communication.md   how agents talk: cards, comments, bulletins, docs
│   ├── 30-memory-and-skills.md   what gets remembered, where, and how it is committed
│   ├── 40-environments.md    one Claude Code environment per department, and Cloudflare
│   ├── 50-definition-of-done.md  per-department exit criteria
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
├── AGENT.md          who it is, what it owns, what it may never do, its loop
├── ROUTINE.md        the exact prompt its Routine fires with (fresh session each time)
├── memory/
│   ├── MEMORY.md         curated, short, always loaded — facts that stay true
│   └── journal/          one file per working day, append-only, never rewritten
├── skills/           Agent Skills the agent wrote for itself (SKILL.md format)
└── docs/             documents it maintains for the rest of the company
```

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
