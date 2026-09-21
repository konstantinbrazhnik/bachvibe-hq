# Persona

File: `agents/qa/personas/<slug>.md`. A persona is a *motivation*, not a test
script. The runner derives the steps from the motivation and the screen.

```markdown
---
name: <slug>
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
```
