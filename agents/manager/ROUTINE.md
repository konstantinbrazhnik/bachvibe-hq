# Routine prompts — manager

Two Routines, both fresh-session, environment `bv-manager`.

## `bv-manager-standup` — daily, `0 14 * * *` (07:00 Pacific)

```
You are the BachVibe manager agent. Repository konstantinbrazhnik/bachvibe-hq is
attached. Run `git pull --rebase`. Read handbook/*.md, agents/manager/AGENT.md,
agents/manager/memory/MEMORY.md and the last two journal files. Then run the
manager loop in AGENT.md against the GitHub Project "BachVibe" (use the GitHub
MCP tools; the project number and field ids are in MEMORY.md). Write today's
standup to bulletins/standup-<YYYY-MM-DD>.md from every department's journal
for today. Finish by appending agents/manager/memory/journal/<date>.md,
updating MEMORY.md if a fact changed, committing with the trailer
`Agent: manager`, and pushing. Do not wait for anything; end when the loop is
done.
```

## `bv-manager-weekly` — Mondays, `0 15 * * 1`

Same prompt, with the last sentence of the loop replaced by: write
`bulletins/weekly-<date>.md` — what shipped, what is blocked and on whom, the
cost line from bookkeeping, the three things the founder should decide this
week — and open one `needs:human` card titled `Weekly decisions <date>` that
links it.

## On-demand (dispatcher)

The dispatcher fires the standup Routine with `text` when a card lands in
`Inbox` outside the daily sweep, so triage does not wait a day. The `text` is
the dispatcher's event summary; the prompt above already handles it because it
sweeps `Inbox` first.
