# 40 — Environments: where each agent runs

Every department is a **Claude Code cloud environment** of its own, and every
agent wake is a **fresh session** in that environment created by a Routine.
Nothing persists in the container between wakes; the repository is the memory
(`30-memory-and-skills.md`). This is deliberate: a fresh session cannot carry
a bad assumption from Tuesday into Thursday.

Verified against the Claude Code docs on 2026-09-21
(https://code.claude.com/docs/en/routines and
https://code.claude.com/docs/en/cloud-environments):

- A Routine runs on a cron (**hourly minimum**) and can also be fired on demand
  by an HTTP `POST` to its `/fire` endpoint with a bearer token, optionally
  carrying a `text` payload the session receives as context. That endpoint is
  what the dispatcher calls.
- Each fire creates a new session; sessions are not reused across fires.
- An environment configures the network policy, environment variables, and a
  setup script that runs once per session (cached). A session may attach more
  than one repository; the environment does not fix the set.
- GitHub Projects on a personal account send **no** webhooks. Repository
  webhooks (`issues`, `issue_comment`, `pull_request`, `label`) do. Hence
  `10-task-bus.md`'s rule that labels mirror fields.

## The eight environments

| Environment | Network | Repos attached by the Routine | Setup script does | Extra vars |
|---|---|---|---|---|
| `bv-manager` | trusted | `bachvibe-hq` | `mount-agent.sh` | `BV_DEPT=manager`, `RUNS_TOKEN` (read the dispatcher's fires ledger) |
| `bv-product` | trusted | `bachvibe-hq`, `Daren-bach` | `mount-agent.sh` | `BV_DEPT=product` |
| `bv-engineering` | custom: npm, Cloudflare, GitHub, `*.bachvi.be` | `bachvibe-hq`, `Daren-bach` (+ `bachvibe-site` when the card says so) | `mount-agent.sh` (runs `npm ci` in the product checkout); `npx wrangler types` | `BV_DEPT=engineering`, `CLOUDFLARE_API_TOKEN` (scoped: Workers + D1 + R2, **preview resources only**) |
| `bv-qa` | custom: same + the preview URL | `bachvibe-hq`, `Daren-bach` | `mount-agent.sh`; Playwright already present | `BV_DEPT=qa`, `E2E_BASE_URL=https://test.bachvi.be` |
| `bv-support` | custom: GitHub, `*.bachvi.be`, Cloudflare (logs), the help-desk API | `bachvibe-hq`, `Daren-bach` **read-only** (no push) | `mount-agent.sh` | `BV_DEPT=support`, help-desk token, `CLOUDFLARE_API_TOKEN` **read-only**: Workers observability + D1 read on preview |
| `bv-marketing` | custom: npm, Cloudflare, GitHub, image and font CDNs | `bachvibe-hq`, `bachvibe-site` | `mount-agent.sh` | `BV_DEPT=marketing`, `CLOUDFLARE_API_TOKEN` scoped to the site's **staging** Worker |
| `bv-bookkeeping` | custom: GitHub, merchant-of-record API, Cloudflare billing API | `bachvibe-hq` | `mount-agent.sh` | `BV_DEPT=bookkeeping`, **read-only** tokens for MoR and Cloudflare billing |
| `bv-admin` | custom: GitHub, plus the state, federal and registrar sites it must read | `bachvibe-hq` | `mount-agent.sh` | `BV_DEPT=admin` — **no credentials at all**; it prepares filings, a person submits them |

**Tokens are API credentials, not environment variables.** A cloud
environment on a Pro or Max plan can hold an *API credential*: the agent
proxy attaches the token to requests for the hosts you list after the request
leaves the VM, so the token never reaches the session, its shell, or any file
(https://code.claude.com/docs/en/cloud-environments#add-api-credentials).
Every `CLOUDFLARE_API_TOKEN` and help-desk or billing token in the table above
is stored that way — host `api.cloudflare.com` (or the vendor's API host),
header `Authorization`, prefix `Bearer`. Only identifiers go in environment
variables: `BV_DEPT`, `CLOUDFLARE_ACCOUNT_ID`, `E2E_BASE_URL`. Two
consequences: a credential applies to every session in its environment, which
is exactly the per-department least privilege the table describes; and the
setup script runs before the proxy connects, so `mount-agent.sh` must never
need a token. Wrangler expects a token variable to exist before it will send
any request, so set `CLOUDFLARE_API_TOKEN=placeholder` as a plain variable in
environments that deploy — the proxy supplies the real value. (Verify on the
first `wrangler whoami` in a new environment that the proxy replaces the
header; if it does not, that one environment falls back to the token as a
variable and the credential still serves direct API calls.)

**The setup script is the mount.** `scripts/mount-agent.sh` reads `BV_DEPT`,
links `agents/$BV_DEPT/CLAUDE.md` to the root's `CLAUDE.local.md` (gitignored,
auto-loaded) and the folder's `.claude/agents/*` and `.claude/skills/*` into
`~/.claude/`. That is what makes the folder the agent (handbook §60.1)
instead of a prompt that lists files to read. It also installs the product
checkout's dependencies so the session can run tests and reproduce.

Three properties are load-bearing:

1. **Least privilege is the environment, not the prompt.** Engineering's
   Cloudflare token cannot reach production D1; bookkeeping's merchant token
   cannot refund. A prompt injection through a support ticket lands in an
   environment that cannot do the thing the injection wants.
2. **No environment holds a production write credential.** Production moves
   when the founder merges `preview` → `main` and Cloudflare Workers Builds
   deploys it — the same path the repo already uses.
3. **Every environment attaches `bachvibe-hq` first**, so the setup script and
   the Routine prompt can read the handbook before anything else loads.

## Routines

One heartbeat Routine per department, plus the dispatcher's on-demand fires.
Exact prompts are in each `agents/<dept>/ROUTINE.md`; the schedule is:

| Routine | Cron (UTC) | Why this cadence |
|---|---|---|
| `bv-support-heartbeat` | hourly | inbound tickets; the dispatcher fires it sooner when mail or a ticket arrives |
| `bv-engineering-heartbeat` | hourly | picks up `Ready` cards the dispatcher missed |
| `bv-qa-heartbeat` | hourly | picks up `needs:qa` |
| `bv-manager-standup` | daily 14:00 (07:00 Pacific) | triage sweep, standup bulletin |
| `bv-manager-weekly` | Mondays 15:00 | weekly report |
| `bv-product-heartbeat` | every 4 h | specs and `needs:product` answers |
| `bv-marketing-heartbeat` | every 4 h | content and site cards |
| `bv-bookkeeping-daily` | daily 12:00 | ledger, anomalies |
| `bv-bookkeeping-monthly` | 1st, 13:00 | the monthly close |
| `bv-admin-weekly` | Tuesdays 15:00 | the 90-day compliance sweep; reminder cards |
| `bv-admin-monthly` | 1st, 15:00 | twelve-month calendar review, source re-check, quarter's tax dates to bookkeeping |

Heartbeats are the floor, not the mechanism. The dispatcher's `/fire` call is
what makes a labelled card start within a minute instead of within an hour.

**And the fire secrets are the trust gate** (§60.3). A department's
`FIRE_URL_*`/`FIRE_TOKEN_*` are created only when its folder's `stage` is
promoted to `autonomous`; a heartbeat Routine is created at `supervised`.
Below that, the folder is used by hand until its output is predictable.

## Cloudflare

| Resource | Purpose | Account |
|---|---|---|
| Worker `bachvibe-dispatch` | GitHub webhooks → labels ↔ project fields → Routine fires; email → tickets | the existing account |
| KV `BV_DISPATCH` | debounce keys, delivery ids (idempotency), field-id cache | same |
| Email Routing `support@bachvi.be` → Email Worker (in `bachvibe-dispatch`) | every support mail becomes an `Inbox` card | same |
| Secrets on the dispatcher | `GITHUB_WEBHOOK_SECRET`, `GITHUB_TOKEN` (fine-grained: issues + projects on the listed repos), `RUNS_TOKEN`, one `FIRE_URL_<DEPT>`/`FIRE_TOKEN_<DEPT>` pair per **autonomous** department | wrangler secrets |
| Worker `bachvibe-site` + `bachvibe-site-staging` | the marketing site (Astro static assets on Workers) | same |
| The product Workers | unchanged: `daren-bach` (main) and `daren-bach-preview` (preview) | same |

Costs: the dispatcher and KV sit inside the free tier at this volume; the site
is static assets. The material cost of this organisation is Claude usage, and
bookkeeping reports it weekly as a line beside Cloudflare and the merchant fees.

## Provisioning order

1. Create the `bachvibe-hq` repo (`scripts/bootstrap-github.sh` creates the
   repo, labels, the project and its fields, and prints the field ids the
   dispatcher needs).
2. Deploy `dispatch/` with `wrangler deploy`; add the repository webhooks it
   prints. Point `support@bachvi.be` at it.
3. Create the eight environments in Claude Code (web), one per row above,
   each with `bash scripts/mount-agent.sh` as its setup script.
4. **Use each folder by hand first** (stage `assisted`): open sessions in the
   environment, run the loop, fix `AGENT.md` and the skills until the output
   is predictable. Then promote to `supervised` and create the heartbeat
   Routine from `ROUTINE.md`; then to `autonomous` and copy the Routine's
   fire URL and token into the dispatcher's secrets.
5. Seed the three epics with `/kickoff`. The manager's first standup triages
   them.

Steps 1–3 are `needs:human` by definition (they create resources). Step 4 is
run once by the founder from a session; `scripts/routines.md` lists every call.
