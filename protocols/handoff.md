# Handoff

A handoff is a **field change plus a comment**. Never a bare label flip.

1. Make sure the card satisfies the `Ready` bar for its type
   (`handbook/10-task-bus.md`). If it does not, finish the brief first.
2. Set `Department` (and the matching `dept:*` label) to the receiver.
3. Set `Status` to `Ready` (or `Testing` for engineering → QA).
4. Comment, signed, with the three lines the receiver reads first:

   ```
   **[support]** · session `…` · 2026-09-21
   **Handing to:** engineering
   **Because:** reproduced on preview build a1b2c3d as attendee; see steps above
   **Start with:** src/worker/expenses.ts — the split ignores `covers: []`
   ```
5. Remove your `agent:<dept>` label. The dispatcher wakes the receiver.

A handoff *back* (QA fails a card, product needs engineering's estimate) is the
same protocol; the card's history is the thread.
