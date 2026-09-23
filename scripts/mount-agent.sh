#!/usr/bin/env bash
# The environment's setup script. Makes agents/$BV_DEPT the session's agent
# without touching the repository: the folder's CLAUDE.md becomes the root's
# CLAUDE.local.md (gitignored, auto-loaded), and its sub-agents and skills are
# linked into the user-level ~/.claude/ where Claude Code discovers them.
#
# In the Claude Code environment: Setup script → `bash scripts/mount-agent.sh`
# and Environment variables → `BV_DEPT=<dept>`.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPT="${BV_DEPT:-}"

if [ -z "$DEPT" ]; then
  echo "mount-agent: BV_DEPT unset — founder session, nothing mounted."
  exit 0
fi
if [ ! -d "$ROOT/agents/$DEPT" ]; then
  echo "mount-agent: no such agent folder agents/$DEPT" >&2
  exit 1
fi

ln -sfn "agents/$DEPT/CLAUDE.md" "$ROOT/CLAUDE.local.md"

mkdir -p "$HOME/.claude/agents" "$HOME/.claude/skills"
for f in "$ROOT/agents/$DEPT/.claude/agents/"*.md; do
  [ -e "$f" ] && ln -sfn "$f" "$HOME/.claude/agents/$(basename "$f")"
done
for d in "$ROOT/agents/$DEPT/.claude/skills/"*/; do
  [ -d "$d" ] && ln -sfn "${d%/}" "$HOME/.claude/skills/$(basename "$d")"
done

# The department's own product-repo checkout, when the Routine attached one,
# needs its dependencies for reproduction and tests.
for repo in "$ROOT/../Daren-bach" "$ROOT/../bachvibe-site"; do
  [ -f "$repo/package.json" ] && (cd "$repo" && npm ci --no-audit --no-fund >/dev/null 2>&1 || true)
done

echo "mount-agent: mounted agents/$DEPT (CLAUDE.local.md, $(ls "$HOME/.claude/agents" 2>/dev/null | wc -l | tr -d ' ') sub-agents, $(ls "$HOME/.claude/skills" 2>/dev/null | wc -l | tr -d ' ') skills)"
