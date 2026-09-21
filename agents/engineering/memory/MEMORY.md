# Engineering — memory

## The product repo
- `Daren-bach`: branch off `preview`, PR into `preview`. `npm run test:ci` is
  the gate. Migrations to remote preview *before* merge. Production is the
  founder's.
- Preview: https://test.bachvi.be · impersonation on · `/api/version`.
- Conventions live in `.claude/skills/last-ride/SKILL.md` — 60 numbered rules,
  each one a bruise. Read it every session; it changes.

## Runbooks (docs/)
- (none yet)

## Gotchas
- Sessions with several repos attached do not load either repo's
  `.claude/settings.json` hooks. Run the checks by hand.
