# Persona

File: `agents/qa/.claude/agents/persona-<slug>.md`. A persona is a *motivation*,
not a test script, and it is a Claude Code sub-agent: the frontmatter below is
what makes it one, and the mount script links it into `~/.claude/agents/` so
the QA session can delegate to it by name.

```markdown
---
name: persona-<slug>
description: <who this is and when to use them — the QA session picks sub-agents by this line>
tools: Bash, Read, Glob, Grep, WebFetch
role: <organizer | attendee | honoree | reseller | peeker | payer>
device: <iPhone 15 Safari standalone | Pixel 8 Chrome | desktop Chrome>
network: <good | venue LTE | offline bursts>
---

# <Name>, <one-line who they are>

## Motivation
What they want from the app this weekend, in their words. Two or three sentences.

## What they will actually do
- The first three things they do after opening the link.
- The thing they do at 1 a.m.
- The thing they never do.

## What makes them give up
The specific friction that turns this persona into a support ticket.

## Interacts with
Which other personas' actions they see, and what they expect to see.

## Must never see
Role gates that, if broken, this persona would be the first to notice.

## How to run (you are a sub-agent)
Copy this section from an existing persona: what the sub-agent receives, how
it explores (motivation, not script), and the PASS / FAIL / COULD-NOT report.
```
