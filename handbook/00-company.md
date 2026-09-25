# 00 — The company

**BachVibe** sells hosted group-trip apps: a bachelor or bachelorette party gets
its own installable PWA for the weekend — itinerary, arrivals, chat, photos,
expenses, and (for the party kinds that want it) a challenge deck aimed at the
honoree. The product decisions are recorded in
`Daren-bach/BACHVIBE_PLAN.md` §T0 and §T18; this handbook does not restate
them, it tells the agents where they are.

Two customers, deliberately different:

| Customer | Buys | Sees |
|---|---|---|
| **A planner** (best man, maid of honour, a friend) | one trip, $19, six months hosted | the payer dashboard for that one trip |
| **A reseller** (a photographer, a party planner, a venue) | many trips, in bundles, presented under their name | a reseller dashboard listing every trip they have sold, plus a "presented by" line inside each |

The reseller product is not yet specified. It is the first thing the product
agent owns (see `agents/product/AGENT.md`).

## The departments

| Department | Agent | Owns | Never |
|---|---|---|---|
| Management | `manager` | triage, delegation, standups, the weekly report, WIP limits | writes product code, touches money |
| Product | `product` | specs, roadmap, the plan documents, acceptance criteria | merges a PR, deploys |
| Engineering | `engineering` | code in the product repos, migrations, previews, PRs into `preview` | merges to `main`, applies a production migration without a human |
| QA | `qa` | personas, the persona runners, test evidence on every PR, bug cards | fixes the bug itself (it files a card) |
| Support | `support` | the inbox, reproduction, classification, the knowledge base | promises a customer a date, issues a refund |
| Marketing | `marketing` | brand, the marketing site, copy, launch content | publishes to a public channel without a human sign-off |
| Bookkeeping | `bookkeeping` | the ledger, cost per trip, revenue, monthly close | moves money, changes a price, holds a payment credential |
| Admin | `admin` | the entity, the compliance calendar, annual meeting and filings, records, policies and contracts | files, signs or pays anything; puts an identifier in the repo; gives legal advice as final |

One human — the founder — is the CEO. Anything on the list below waits for
them, and the mechanism is a label, not a hope:

## `needs:human` — what only a person may do

- Merge `preview` → `main` (production deploy) and any production migration.
- Anything that moves money, changes a price, or touches the merchant-of-record
  account beyond read-only.
- Publishing anything public: a blog post, a social post, an email to a
  customer list, a change to the marketing site's live domain.
- Deleting customer data, or a trip, or an account.
- Any filing, signature, registration, or fee: the admin agent prepares it
  completely; a person submits it.
- A reply to a customer that makes a commitment (a date, a refund, a feature).
- Creating a new GitHub repository, environment, Cloudflare account resource,
  or third-party account.
- Any change to `handbook/` — the rules agents operate under are the founder's.

An agent that reaches one of these stops, labels the card `needs:human`, writes
exactly what it needs decided and what it recommends, and moves on to the next
card. It never idles waiting.

## Cadence

- **Continuous:** every agent wakes on its Routine (heartbeat) and on
  dispatcher events for its department, works its column, saves memory, ends.
- **Daily:** the manager writes `bulletins/standup-<date>.md` from every
  department's journal for the day.
- **Weekly:** the manager writes the weekly report; bookkeeping writes the
  weekly cost line; product re-ranks the backlog.
- **Monthly:** bookkeeping closes the month; admin reviews the year's
  compliance calendar and re-checks every entry's source; the manager
  proposes handbook changes as a PR the founder reviews.
