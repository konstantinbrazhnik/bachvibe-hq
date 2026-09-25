#!/usr/bin/env bash
# Creates the GitHub side of the company: the HQ repo, the labels on every
# routed repo, the "BachVibe" project with its fields, and prints the ids the
# dispatcher needs. Idempotent: re-running updates rather than duplicates.
#
# Requires: gh (authenticated with `project` and `repo` scopes), jq.
#   gh auth refresh -s project,repo
set -euo pipefail

OWNER="${OWNER:-konstantinbrazhnik}"
HQ_REPO="${HQ_REPO:-bachvibe-hq}"
SITE_REPO="${SITE_REPO:-bachvibe-site}"
PRODUCT_REPO="${PRODUCT_REPO:-Daren-bach}"
PROJECT_TITLE="${PROJECT_TITLE:-BachVibe}"
CREATE_REPOS="${CREATE_REPOS:-0}"   # set to 1 to create bachvibe-hq / bachvibe-site

# ---------- repositories ----------
if [ "$CREATE_REPOS" = "1" ]; then
  for r in "$HQ_REPO" "$SITE_REPO"; do
    if ! gh repo view "$OWNER/$r" >/dev/null 2>&1; then
      gh repo create "$OWNER/$r" --private --description "BachVibe — $r"
      echo "created $OWNER/$r"
    fi
  done
fi

# ---------- labels (mirrors handbook/10-task-bus.md) ----------
label() { # repo name color description
  gh label create "$2" --repo "$OWNER/$1" --color "$3" --description "$4" --force >/dev/null
}
for repo in "$HQ_REPO" "$PRODUCT_REPO" "$SITE_REPO"; do
  gh repo view "$OWNER/$repo" >/dev/null 2>&1 || { echo "skip labels: $OWNER/$repo does not exist"; continue; }
  for d in manager product engineering qa support marketing bookkeeping admin; do
    label "$repo" "dept:$d" 1D76DB "Owned by the $d department"
    label "$repo" "agent:$d" C5DEF5 "A $d session is working this card"
  done
  for t in bug feature ticket spec content ledger chore epic; do
    label "$repo" "type:$t" 5319E7 "Card type: $t"
  done
  for p in P0 P1 P2 P3; do label "$repo" "$p" B60205 "Priority $p"; done
  label "$repo" "needs:human"      FBCA04 "Waiting on the founder; agents skip it"
  label "$repo" "needs:qa"         0E8A16 "Ready for persona testing"
  label "$repo" "needs:product"    0E8A16 "Needs a decision or spec"
  label "$repo" "needs:support"    0E8A16 "Needs reproduction or customer context"
  label "$repo" "needs:engineering" 0E8A16 "Needs an estimate or a technical answer"
  label "$repo" "needs:marketing"  0E8A16 "Needs copy, an asset, or brand input"
  label "$repo" "needs:bookkeeping" 0E8A16 "Needs a number"
  label "$repo" "needs:admin"       0E8A16 "Needs a compliance, entity, or contract answer"
  label "$repo" "blocked"          D93F0B "Blocked; the blocker is in the last comment"
  echo "labels: $OWNER/$repo"
done

# ---------- project ----------
PROJECT_NUMBER=$(gh project list --owner "$OWNER" --format json | jq -r --arg t "$PROJECT_TITLE" '.projects[] | select(.title==$t) | .number' | head -1)
if [ -z "$PROJECT_NUMBER" ]; then
  PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json | jq -r .number)
  echo "created project #$PROJECT_NUMBER"
fi

field() { # name options(csv)
  if ! gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json | jq -e --arg n "$1" '.fields[] | select(.name==$n)' >/dev/null; then
    gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "$1" --data-type SINGLE_SELECT --single-select-options "$2" >/dev/null
    echo "field: $1"
  fi
}
# Status exists on every project; its options are edited in the UI to:
#   Inbox, Triage, Ready, In Progress, In Review, Testing, Done, Blocked
field Department "Management,Product,Engineering,QA,Support,Marketing,Bookkeeping,Admin"
field Type       "bug,feature,ticket,spec,content,ledger,chore,epic"
field Priority   "P0,P1,P2,P3"
if ! gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json | jq -e '.fields[] | select(.name=="Persona")' >/dev/null; then
  gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name Persona --data-type TEXT >/dev/null; echo "field: Persona"
fi
if ! gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json | jq -e '.fields[] | select(.name=="Epic")' >/dev/null; then
  gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name Epic --data-type TEXT >/dev/null; echo "field: Epic"
fi

# Link every routed repo so its issues can be added.
for repo in "$HQ_REPO" "$PRODUCT_REPO" "$SITE_REPO"; do
  gh repo view "$OWNER/$repo" >/dev/null 2>&1 && gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$OWNER/$repo" >/dev/null 2>&1 || true
done

cat <<OUT

Done.
  PROJECT_NUMBER=$PROJECT_NUMBER     → hq/dispatch/wrangler.jsonc "PROJECT_NUMBER"
  Status options must be renamed by hand in the project UI (gh cannot edit
  the built-in Status field): Inbox, Triage, Ready, In Progress, In Review,
  Testing, Done, Blocked.
  Then create one saved view per department, filtered on Department, as a board by Status.
Field ids (the dispatcher fetches these itself; printed for reference):
OUT
gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json | jq -r '.fields[] | "  \(.name)\t\(.id)"'
