# Runbook

File: `agents/<dept>/docs/runbooks/<slug>.md`. A procedure learned from a real
incident or a real repetition. If it has been run twice and is stable, it
becomes a skill in `.claude/skills/` and the runbook links to it.

```markdown
---
title: <verb phrase: "Correlate a build id with its commit and PR">
last_verified: <YYYY-MM-DD>
tags: []
---

## When
The trigger that means you run this.

## Steps
Numbered. Each with the command or the exact place to click, and what you
should see. A step whose result you cannot observe is not a step.

## When it does not work
The failure modes seen so far and what each meant.
```
