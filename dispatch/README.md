# bachvibe-dispatch

The Worker that turns GitHub events and support email into agent work. It is
the only always-on process in the company, and it does no thinking: it keeps
labels and project fields in step and fires the right department's Routine.

```
GitHub repo webhooks ─┐
                      ├─→ POST /github ─→ labels ⇄ project fields ─→ fire(dept)
support@bachvi.be ────┘        email ─→ Inbox card (type:ticket) ─→ fire(support)
cron */15 ────────────────→ reconcile: fields → labels for cards humans dragged
```

## Deploy

```bash
cd hq/dispatch
npm install
npx wrangler kv namespace create STATE      # paste the id into wrangler.jsonc
npx wrangler secret put GITHUB_WEBHOOK_SECRET
npx wrangler secret put GITHUB_TOKEN        # fine-grained: Issues RW, Projects RW, on REPOS only
npx wrangler secret put RUNS_TOKEN          # any long random string; goes in the manager's MEMORY.md
for d in MANAGER PRODUCT ENGINEERING QA SUPPORT MARKETING BOOKKEEPING ADMIN; do
  npx wrangler secret put FIRE_URL_$d       # from the Routine's API trigger
  npx wrangler secret put FIRE_TOKEN_$d
done
npm run deploy
```

Then, on each repository in `REPOS`: Settings → Webhooks → add
`https://bachvibe-dispatch.<account>.workers.dev/github`, content type JSON,
the same secret, events `issues`, `issue_comment`, `pull_request`,
`pull_request_review`, `check_suite`. And in Cloudflare Email Routing, route
`support@bachvi.be` to this Worker.

A department whose `FIRE_*` secrets are missing is simply not woken by events;
its hourly heartbeat still runs. That is the intended degraded mode while the
Routines are being set up one at a time.

## The runs ledger

Every fire is recorded (`run:<dept>:<iso>`, kept 14 days) and served at
`GET /runs?hours=48` with `Authorization: Bearer $RUNS_TOKEN`. A fire with no
journal entry from that department within two hours is a stalled session; the
manager's standup and the founder's `/hey` both read this.

## Dumb-problem fixtures

`fixtures/` holds the inputs that break naive parsers — em dashes, curly
quotes, emoji, a 4 000-character body, an empty subject, a subject with a
newline. `npm run smoke` runs the email handler and the webhook router over
them and must pass before deploy. Add a fixture the day a new one bites.

## What it deliberately does not do

- Read or write code, merge, deploy. The token cannot.
- Decide anything. Routing is a lookup from label to department.
- Retry a fire. A failed fire is logged; the heartbeat is the retry.
