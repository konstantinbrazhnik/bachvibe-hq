# Card template

Paste into the issue body when moving a card to `Ready`. Delete the sections
that do not apply, but never the **Context** and **Done when** sections.

```markdown
## Context
<!-- One paragraph. Who is affected, what they were trying to do, why it matters.
     Link the source: support ticket, plan section, bulletin, parent epic. -->

## Type-specific
<!-- bug -->
**Build:** <id from /api/version on preview>   **Env:** preview
**Persona / role:** <e.g. attendee, non-organizer>   **Device:** <iOS Simulator 17 / Pixel 8 / desktop Chrome>
**Steps:**
1. …
**Expected:** …
**Actual:** …
**Evidence:** <screenshot / trace path / log line>

<!-- feature -->
**Customer problem:** …
**Plan reference:** BACHVIBE_PLAN.md §…
**Out of scope:** …

<!-- content -->
**Audience:** …  **Channel:** …  **Goal:** …  **Brand section:** …  **Sign-off:** founder

## Done when
- [ ] …
- [ ] Personas: <organizer, attendee, honoree, reseller, peeker>
- [ ] Evidence posted on this card

## Handoff notes
<!-- Anything the next department needs that is not obvious from the above.
     Files to look at, a prior attempt, a related card. -->
```
