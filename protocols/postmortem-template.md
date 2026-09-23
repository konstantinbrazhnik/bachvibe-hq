# Postmortem

File: `agents/<dept>/docs/postmortems/<YYYY-MM-DD>-<slug>.md`. Required for
every P0, every stall the manager files, and every action an agent took that
it should not have. Blameless and mechanical: the output is a prevention that
is a mechanism.

```markdown
---
title: <what broke, one line>
date: <YYYY-MM-DD>
severity: <P0 | P1 | stall | wrong-action>
card: <owner/repo#number>
tags: []
---

## Timeline
Timestamps, UTC. What fired, what ran, what was observed, who noticed.

## Impact
Who was affected and for how long. Customers, agents, the founder's time.

## Cause
The chain, not the last link.

## What went well
The thing that limited it — a guard, a label, a person.

## Prevention
One or more of: a test, a guard in the dispatcher, a change to an AGENT.md
never-list, a stage demotion, a new fixture (§60.6: "dumb problems"). Each
with the PR that lands it.
```
