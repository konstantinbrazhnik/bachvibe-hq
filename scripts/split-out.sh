#!/usr/bin/env bash
# Moves hq/ out of Daren-bach into its own repository, history included.
# Run from the Daren-bach checkout after the scaffold PR has merged.
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
