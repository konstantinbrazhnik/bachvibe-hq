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
for d in MANAGER PRODUCT ENGINEERING QA SUPPORT MARKETING BOOKKEEPING; do
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

## What it deliberately does not do

- Read or write code, merge, deploy. The token cannot.
- Decide anything. Routing is a lookup from label to department.
- Retry a fire. A failed fire is logged; the heartbeat is the retry.
