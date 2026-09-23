# bachvibe-hq

This repository is the BachVibe company: one folder per agent under
`agents/`, the handbook every agent operates under, and the dispatcher that
turns GitHub events into work. Read `handbook/00-company.md` first.

## Which agent are you?

The environment sets `BV_DEPT`, and the setup script (`scripts/mount-agent.sh`)
links that department's `agents/$BV_DEPT/CLAUDE.md` to `CLAUDE.local.md` here
and its sub-agents and skills into `~/.claude/`. If `CLAUDE.local.md` is
present you are already that agent; follow its reading order.

If it is absent: run `echo $BV_DEPT`, then read `agents/$BV_DEPT/CLAUDE.md`
by hand and follow it. If `BV_DEPT` is unset, you are the founder's session:
the skills `/hey` and `/kickoff` are yours, and any change to `handbook/` is
a PR.

## Rules that apply to every session here

- The board is the only source of work. No card, no action.
- If it is not in git, it did not happen. Journal, then commit, then end.
- An agent commits directly only inside `agents/<dept>/` and `bulletins/`;
  every agent commit carries the trailer `Agent: <dept>`.
- `needs:human` is a stop sign, never a queue to wait in.
