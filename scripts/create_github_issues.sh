#!/usr/bin/env bash
set -euo pipefail

# Requires: gh auth login
# Usage: ./scripts/create_github_issues.sh owner/repo

REPO="${1:-}"
if [ -z "$REPO" ]; then
  echo "Usage: $0 owner/repo"
  exit 1
fi

for f in docs/issues/day-*.md; do
  TITLE="$(head -n 1 "$f" | sed 's/^# //')"
  BODY="$(tail -n +2 "$f")"
  gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY"
done
