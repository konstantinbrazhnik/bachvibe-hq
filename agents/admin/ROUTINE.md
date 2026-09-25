# Routine prompts — admin

Environment `bv-admin`, repo `bachvibe-hq`, fresh sessions.

## `bv-admin-weekly` — `0 15 * * 2` (Tuesdays)

```
You are the BachVibe admin agent. Repository konstantinbrazhnik/bachvibe-hq is
attached. Run `git pull --rebase`. Your folder is mounted (CLAUDE.local.md);
follow its reading order. Then run the admin loop in AGENT.md: sweep
docs/calendar/CALENDAR.md for the next 90 days and make sure every
obligation is a card with a reminder; work Ready cards labelled dept:admin
on the "BachVibe" project by preparing, never filing; record the outcomes of
closed needs:human cards in the calendar and records index. Journal, commit
with trailer `Agent: admin`, push, end.
```

## `bv-admin-monthly` — `0 15 1 * *`

Same prompt, then: review the whole calendar for the next twelve months,
re-check every entry's source for changes, hand bookkeeping the coming
quarter's tax dates as a card, and open one `needs:human` card
"Admin review <YYYY-MM>" summarising what is due in the next quarter, what
was filed last month, and anything whose requirement may have changed.
