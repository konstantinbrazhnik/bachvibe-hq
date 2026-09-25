#!/usr/bin/env bash
# Moved hq/ out of Daren-bach into this repository, history included — run
# once on 2026-09-25. Kept as the record of how, and as the pattern for
# splitting a department out later (change the prefix).
#
#   CREATE_REPOS=1 hq/scripts/bootstrap-github.sh     # creates bachvibe-hq first
#   hq/scripts/split-out.sh
set -euo pipefail
OWNER="${OWNER:-konstantinbrazhnik}"
HQ_REPO="${HQ_REPO:-bachvibe-hq}"
BRANCH="${BRANCH:-hq-split}"

git subtree split --prefix=hq -b "$BRANCH"
git push "https://github.com/$OWNER/$HQ_REPO.git" "$BRANCH:main"
git branch -D "$BRANCH"
echo "pushed hq/ history to $OWNER/$HQ_REPO main."
echo "Now open a PR in Daren-bach that deletes hq/ and points README at the new repo."
