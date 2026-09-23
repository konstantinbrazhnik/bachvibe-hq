# Solution

File: `agents/<dept>/docs/solutions/<slug>.md`. Written in the Compound step
for every problem that was actually solved. The frontmatter is what future
sessions search; keep tags concrete (a file name, a feature, an error string).

```markdown
---
title: <one line — the symptom, not the fix>
date: <YYYY-MM-DD>
card: <owner/repo#number>
category: <bug | incident | procedure | decision | tooling>
tags: [expenses, splitShares, rounding, D1]
symptom: <what was observed, one line>
root_cause: <one line>
---

## What happened
Two or three sentences. Include the build id and the persona if relevant.

## Why
The actual cause. If the first theory was wrong, say what it was and why it
was wrong — the wrong theory is the part the next session will also have.

## Fix
What changed, with the PR link.

## Prevention
The mechanism that catches it next time: the test, the guard, the validator,
the convention promoted to CLAUDE.md or the last-ride skill. "Be careful" is
not a prevention.

## See also
Links to related solutions, postmortems, runbooks.
```
