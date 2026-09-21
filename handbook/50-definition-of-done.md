# 50 — Definition of done, per department

A card moves to `Done` only when its department's list is satisfied *and* the
closing comment shows the evidence. "Done" with no evidence is `In Review`.

## Engineering

- [ ] Branch off `preview`, PR into `preview`, per `Daren-bach`'s `branching` skill.
- [ ] `npm run test:ci` green locally and in CI; new logic has unit or worker tests.
- [ ] The product repo's own definition of done (`last-ride` skill) is met —
      role enforcement server-side, realtime message typed, offline-safe, and
      the skill/ARCHITECTURE.md updated if a convention changed.
- [ ] Migration applied to the remote **preview** database before the merge
      (`npm run migrate:preview`); production migrations are `needs:human`.
- [ ] Preview URL and build id posted on the card, `needs:qa` set, personas named.
- [ ] Nothing merged to `main`. Ever. That is the founder's PR.

## QA

- [ ] Every persona the card names has run against the preview build id on
      the card, on both a phone-sized viewport and the native simulators
      where the change is user-visible.
- [ ] Interaction scenarios (organizer ↔ attendee, honoree ↔ crew, reseller
      ↔ their planner) ran where the card touches shared state.
- [ ] Each failure is its own `type:bug` card with the persona, the step, the
      expected and actual, and a trace or screenshot. QA never fixes.
- [ ] A pass is a closing comment naming personas, build id, and evidence path.

## Support

- [ ] Every inbound item is classified within one heartbeat: `bug`, `feature`,
      `question`, `billing`, or `spam`.
- [ ] A bug is reproduced in **preview** (never production) with impersonation
      before it becomes an engineering card; if it cannot be reproduced, the
      card says so and what was tried.
- [ ] A question is answered from the knowledge base, and the knowledge base
      gained an entry if it could not be.
- [ ] Billing and anything promising a date or a refund is `needs:human`.
- [ ] The customer got a reply within the SLA in `agents/support/AGENT.md`,
      even if the reply is "we are looking at it".

## Product

- [ ] A spec has: the problem, the customer it is for, acceptance criteria as
      a checklist, personas, out-of-scope, and the plan section it amends.
- [ ] `BACHVIBE_PLAN.md` (or its successor) updated by PR when a decision
      changed, in the same style as the existing plan: decision, reasoning, cost.
- [ ] Backlog re-ranked weekly with a one-paragraph rationale in the journal.

## Marketing

- [ ] Every asset traces to a section of the brand book.
- [ ] Copy checked against the lexicon (no "Daren", no tour vernacular leaking
      into product-neutral surfaces).
- [ ] Site changes ship to the staging domain; the live domain is `needs:human`.

## Bookkeeping

- [ ] Every number cites its source export and period.
- [ ] Cost per trip recomputed monthly against `BACHVIBE_PLAN.md` §T20.
- [ ] Anomalies (a cost line that moved > 25 %, a refund, a chargeback) become
      a card for the manager the same day.

## Management

- [ ] Nothing sits in `Inbox` longer than one heartbeat, or in `Triage` longer
      than a day.
- [ ] Standup written daily; weekly report written weekly; both from journals
      and the board, never from memory.
- [ ] Every `needs:human` card has a recommendation on it, not just a question.
