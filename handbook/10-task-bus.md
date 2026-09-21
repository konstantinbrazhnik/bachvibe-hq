# 10 — The task bus: one GitHub Project

There is **one** GitHub Project, `BachVibe`, owned by the founder's account. It
spans every repository (`bachvibe-hq`, `Daren-bach`, `bachvibe-site`, and any
repo added later). Every unit of work is an **issue** in the repository whose
code it is about, added to this one project. There are no per-department
projects: a handoff is a field change, not a move between boards, so nothing is
ever lost in transit.

## Fields

| Field | Type | Values |
|---|---|---|
| `Status` | single select | `Inbox` → `Triage` → `Ready` → `In Progress` → `In Review` → `Testing` → `Done`, plus `Blocked` |
| `Department` | single select | `Management`, `Product`, `Engineering`, `QA`, `Support`, `Marketing`, `Bookkeeping` |
| `Type` | single select | `bug`, `feature`, `ticket`, `spec`, `content`, `ledger`, `chore`, `epic` |
| `Priority` | single select | `P0` (customer down), `P1` (this week), `P2` (this month), `P3` (someday) |
| `Persona` | text | which QA persona(s) must sign off, e.g. `organizer,attendee` |
| `Epic` | text | the parent epic's issue number |

Every department gets a **saved view** filtered on its `Department`, shown as
a board by `Status`. That is its Kanban. The manager's view is the whole
project grouped by department.

## Labels mirror the fields

GitHub Projects (v2) on a personal account do not send webhooks, so the
dispatcher cannot see a field change. Labels on the issue are what it *can*
see. Rule: **the `Department` field and the `dept:*` label always agree**, and
the dispatcher keeps them that way (it sets the field when a label changes and
vice versa on its next sweep). Agents may change either; the dispatcher
reconciles.

| Label | Meaning |
|---|---|
| `dept:engineering` … `dept:bookkeeping` | who owns it now |
| `type:bug` `type:feature` `type:ticket` … | mirrors `Type` |
| `P0` `P1` `P2` `P3` | mirrors `Priority` |
| `needs:human` | waiting on the founder; agents skip it |
| `needs:qa` | engineering says it is ready for personas |
| `needs:product` | needs a decision or a spec before anyone can build it |
| `blocked` | mirrors `Status: Blocked`; the blocker is named in the last comment |
| `agent:<dept>` | set by the agent that is currently working the card |

## The columns, and who moves a card

| Status | Who moves it here | What it must contain when it arrives |
|---|---|---|
| `Inbox` | anyone, the dispatcher, a support email | a title and whatever was received |
| `Triage` | manager | a `Department`, a `Type`, a `Priority` |
| `Ready` | product (features), support (bugs), manager (everything else) | the card template filled in (`protocols/card-template.md`); a feature has acceptance criteria and a persona list; a bug has reproduction steps that worked in preview |
| `In Progress` | the owning agent, when it starts | the `agent:<dept>` label and a comment saying which session took it |
| `In Review` | engineering, when the PR is open | a PR link, CI green, the PR body filled from the card |
| `Testing` | engineering, with `needs:qa` | a preview URL and which personas apply |
| `Done` | QA (after personas pass) or the owning agent for non-code work | a closing comment: what shipped, where, and the evidence |
| `Blocked` | anyone | the blocker in the last comment, and a `needs:*` label naming who can unblock |

Two rules keep the board honest:

- **A card may not skip `Ready`.** An agent that finds a card in `Triage`
  addressed to it fills in the template first, then starts. Half the value of
  the system is that a card is a complete brief.
- **WIP limits are per department, and the manager enforces them:**
  Engineering 3, QA 3, everyone else 2. Above the limit the manager stops
  moving cards to `Ready` for that department and says so in the standup.

## Epics

The three the company starts with (see `AGENT_ORG_PLAN.md` §8):

1. **Marketing site** — `bachvibe-site`, Astro on Cloudflare Workers.
2. **Brand** — a brand book grown from `handbook/brand/BRAND.md`.
3. **Portal** — the payer dashboard and the reseller dashboard, per
   `BACHVIBE_PLAN.md` §T18.3, plus the reseller spec the product agent writes.

An epic is a `type:epic` issue whose body is a checklist of child issues. The
manager keeps the checklist current; the epic's own `Status` is derived by
the manager from its children on every standup.
