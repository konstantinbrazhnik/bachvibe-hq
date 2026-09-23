# 60 — The folder is the agent, and every task compounds

Two sources shaped this section, and the handbook cites them so the reasoning
can be re-checked when they change: Kieran Klaassen's *The Folder Is the
Agent* (Every, April 2026, https://every.to/source-code/the-folder-is-the-agent)
and Every's *Compound Engineering* guide
(https://every.to/guides/compound-engineering) with its plugin
(https://github.com/EveryInc/compound-engineering-plugin). What follows is not
a summary of them; it is what this company does because of them, mapped to a
mechanism in this repository.

## 1. An agent is a model pointed at a folder

> "A model with enough context so you don't have to re-explain everything
> each time you open the chat."

So every `agents/<dept>/` is a **real Claude Code project**, not a prompt that
tells a session what to read:

```
agents/support/
├── CLAUDE.md               auto-loaded; states the reading order and the stage
├── AGENT.md                identity: owns, never, loop
├── ROUTINE.md              the Routine prompt (short — the folder does the work)
├── .claude/
│   ├── agents/             sub-agents: reviewers, personas, specialists
│   └── skills/             skills the agent grew (Agent Skills format)
├── memory/MEMORY.md        curated facts; memory/journal/ append-only days
└── docs/
    ├── solutions/          one file per solved problem, YAML frontmatter, tags
    ├── runbooks/           procedures learned from real incidents
    ├── postmortems/        every P0, every stall, every wrong action
    └── plans/              plans for cards this agent owns
```

**Mounting.** A cloud session's working directory is the repository root, so
the environment's setup script (`scripts/mount-agent.sh`, driven by the
`BV_DEPT` variable) links the department's `CLAUDE.md` to `CLAUDE.local.md`
at the root and its `.claude/agents/*` and `.claude/skills/*` into the user
level `~/.claude/`. Claude Code then loads the folder's context, sub-agents
and skills natively; the Routine prompt shrinks to "run your loop". If the
mount is missing, the root `CLAUDE.md` says how to find the folder by hand,
so a session is never blind.

**Reading order is stated, not implied.** Klaassen's dev agent reads
CLAUDE.md → architecture → system report → prompt → component agent. Ours is
in each `CLAUDE.md`: handbook → `AGENT.md` → `MEMORY.md` → the last two
journals → the `docs/solutions/` index → the card.

## 2. Ops and dev are different folders

His `~/cora/` (feature work) and `~/cora-agent/` (operations, isolated from
production code so it cannot modify it by accident) are the split between our
**engineering** and **support** folders. Institutionalised:

- Support's environment attaches the product repo **read-only** (no push
  credential). It runs the app to reproduce; it never changes it.
- Support carries the ops skills his ops agent has: tail Worker logs, read
  the preview D1 (read-only), correlate a build id from `/api/version` with a
  commit and a PR, read the help desk. See `agents/support/AGENT.md`.
- Incident history lives in support's `docs/postmortems/` and
  `docs/runbooks/`, which engineering's plan step reads (§4).

## 3. You can't vibe orchestrate

> Build it. Use it. Trust it. Then orchestrate it. Skipping steps produces
> duplicate PRs, issues filed for finished work, and failed automation.

Every agent folder carries a **stage** in its `CLAUDE.md` frontmatter, and
the stage is a gate, not a label:

| Stage | Meaning | What runs |
|---|---|---|
| 0 `manual` | the folder exists; the founder works in it by hand | nothing scheduled |
| 1 `assisted` | the founder opens sessions in the folder and runs the loop, correcting `AGENT.md` and skills until the output is predictable | nothing scheduled |
| 2 `supervised` | the heartbeat Routine runs, but every card the agent would move past `Ready` is labelled `needs:human` first | heartbeat only; dispatcher fire secrets **not set** |
| 3 `autonomous` | the agent moves its own cards | heartbeat + dispatcher fires |

The mechanism is deliberately dumb: a department the dispatcher can fire is
one whose `FIRE_URL_*` / `FIRE_TOKEN_*` secrets exist, and those are created
only when the founder promotes the folder to stage 3. Promotion is a PR that
changes the frontmatter and a comment in the journal saying what was observed
to be predictable. Demotion is the same PR in reverse and needs no reason.

Nobody skips a stage. The first two are where `AGENT.md` stops being a guess.

## 4. Every task compounds: Plan → Work → Review → Compound

The compound-engineering loop, applied to every card in every department:

1. **Plan** — before starting, search `docs/solutions/` in your own folder
   *and* in support's and engineering's for the tags on the card. "Run one
   teaches it. Run two remembers." A plan for a non-trivial card is a file
   in `docs/plans/<card>.md` and is linked from the card.
2. **Work** — one card at a time. Engineering uses a git worktree per card
   when two are in flight, so branches never share a checkout.
3. **Review** — engineering runs the product repo's `code-review` and
   `security-review` skills and its own `.claude/agents/` reviewers *before*
   handing to QA; findings are P1 (must), P2 (should), P3 (nice). Every
   handoff and every PR answers the three questions
   (`protocols/handoff.md`): the hardest decision, the rejected
   alternatives, the least confident part. Reviewers read intent; the
   reviewers' agents read the code.
4. **Compound** — the step that is never skipped, and the one that
   distinguishes a memory from a diary:
   - A **solved problem** becomes `docs/solutions/<slug>.md` with frontmatter
     (`tags`, `category`, `card`, `date`, `symptom`, `fix`, `prevention`).
   - A **procedure run twice** becomes a skill in `.claude/skills/`.
   - A **P0, a stall, or a wrong action** becomes `docs/postmortems/<date>-<slug>.md`
     with a prevention that is a mechanism, not a reminder.
   - A **pattern that will recur** is promoted into `CLAUDE.md` or `AGENT.md`
     by PR, or into the product repo's `last-ride` skill by PR, which is what
     that skill already is: sixty compounded bruises.
   - A **check that could have caught it** is added: a test, a guard, a
     validator. "Taste belongs in systems, not reviews."

The closing comment on a card names what was compounded, or says "nothing
to compound" and why. The manager's standup counts both.

## 5. The human is the bottleneck, so design for the human

> "AI agents don't have a speed limit, but the person managing them still
> does."

- **`/hey`** — the founder's morning briefing, a skill at the HQ root
  (`.claude/skills/hey/`): completed, errors, blockers, P0s, and every
  `needs:human` card with its recommendation, across all departments, in one
  screen. The manager's daily standup is the same report written to a file;
  `/hey` is the founder asking for it now.
- **`/kickoff`** — the founder's `/orchestrate`: one sentence in, an epic
  with decomposed child cards out, each routed to a department and written
  as a complete brief. The founder approves the decomposition before any
  card moves to `Ready`.
- **Results are pull requests**, reviewed asynchronously. Nothing an agent
  produces needs the founder to be present when it finishes.
- **Parallelism comes from departments, not from fan-out inside one.** Each
  session works one card. The exception is QA's personas, which is research
  shaped work (many independent explorations, one synthesis) and the one
  place the multi-agent token cost buys something. Bookkeeping reports the
  Claude bill per department so this stays a decision rather than a drift.

## 6. Stalls, drift, and dumb problems

His three operational findings, each with a mechanism here:

- **Agent stalls "freeze indefinitely without obvious indicators."** A stalled
  session never writes its journal, so the journal cannot detect it. The
  dispatcher records every fire (`run:<dept>:<timestamp>` in KV, readable at
  `GET /runs`); the manager's standup compares fires against journal entries
  and files a `type:chore` card for any fire with no journal entry two hours
  later. The card names the department and the event it was fired for.
- **Context drift: duplicate work, stale task versions.** One `agent:<dept>`
  label per card is the lock; a lock older than four hours with no comment is
  stale and may be taken over (the taker says so). The manager searches
  before creating a card, and closes duplicates with a link.
- **"Genuinely dumb problems that are shockingly hard to find"** (his file
  daemon crashed on em dashes and curly quotes). Every automation component
  here ships with a fixture made of pasted rich text: em dashes, curly
  quotes, emoji, a 4 000-character body, an empty subject. `dispatch/`'s
  email handler is the first; the rule applies to anything that parses what
  a human typed.

## 7. What this changes in the order of operations

`AGENT_ORG_PLAN.md` §9 is revised: the founder runs the **manager** folder by
hand for a week (stage 1) before any Routine exists; each department is then
promoted through the stages on its own evidence. Turning on nine Routines in
a week is the swarm he spent three months learning not to build.
