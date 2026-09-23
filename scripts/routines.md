# Creating the Routines

Routines are created from inside a Claude Code session in the target
environment (the session inherits the environment, so the Routine does too).
For each row: open a session in that environment, paste the prompt from the
department's `ROUTINE.md`, and ask Claude to create the Routine with the cron
below and **a fresh session per fire**. Then, in the Routine's settings, enable
the **API trigger** and copy its fire URL and token into the dispatcher's
secrets (`FIRE_URL_<DEPT>` / `FIRE_TOKEN_<DEPT>`).

| Routine | Environment | Cron (UTC) | Prompt file |
|---|---|---|---|
| `bv-manager-standup` | `bv-manager` | `0 14 * * *` | `agents/manager/ROUTINE.md` |
| `bv-manager-weekly` | `bv-manager` | `0 15 * * 1` | `agents/manager/ROUTINE.md` |
| `bv-product-heartbeat` | `bv-product` | `0 */4 * * *` | `agents/product/ROUTINE.md` |
| `bv-engineering-heartbeat` | `bv-engineering` | `0 * * * *` | `agents/engineering/ROUTINE.md` |
| `bv-qa-heartbeat` | `bv-qa` | `0 * * * *` | `agents/qa/ROUTINE.md` |
| `bv-support-heartbeat` | `bv-support` | `0 * * * *` | `agents/support/ROUTINE.md` |
| `bv-marketing-heartbeat` | `bv-marketing` | `0 */4 * * *` | `agents/marketing/ROUTINE.md` |
| `bv-bookkeeping-daily` | `bv-bookkeeping` | `0 12 * * *` | `agents/bookkeeping/ROUTINE.md` |
| `bv-bookkeeping-monthly` | `bv-bookkeeping` | `0 13 1 * *` | `agents/bookkeeping/ROUTINE.md` |

The on-demand fires from the dispatcher target the department's heartbeat
Routine (for the manager, the standup one). The prompts already sweep the
whole column, so an on-demand fire and a scheduled fire run the same loop; the
`text` the dispatcher passes only says which card to start with.

## Ramp-up — stages, not a switch

A Routine exists only for a folder at stage `supervised` or above, and the
dispatcher can fire only a folder at `autonomous` (handbook §60.3). Every
department goes 0 → 1 → 2 → 3 on its own evidence; the stage is the
frontmatter of its `CLAUDE.md` and changes by the founder's PR. Order that
produces value soonest and keeps the founder able to watch each one:

0. The **manager folder by hand** for a week: the founder opens sessions in
   `bv-manager`, runs `/hey` and the triage loop, and edits `AGENT.md` until
   the standup reads right. Only then:
1. `bv-manager-standup` — a day of standups against a seeded board proves the
   board contract before any agent acts on it.
2. `bv-product-heartbeat` — writes the reseller spec and the portal cards.
3. `bv-marketing-heartbeat` — brand directions and the site skeleton (both
   land as `needs:human`).
4. `bv-engineering-heartbeat` + `bv-qa-heartbeat` — once there are `Ready` cards.
5. `bv-support-heartbeat` — once `support@bachvi.be` is routed.
6. `bv-bookkeeping-*` — once there is a merchant-of-record account to read.
