#!/usr/bin/env bash
#
# Build the app and commit the result to the `deploy` branch, which the
# server pulls. The source on `main` is not touched: the deploy branch is
# checked out in a separate worktree (.deploy-worktree/).
#
# Usage:
#   scripts/deploy.sh                 build and commit locally, don't push
#   scripts/deploy.sh --push          also push the deploy branch
#
# Settings (environment variables):
#   SITE_URL   public address of the site (default https://hazards.climatefutures-mm.org)
#   REMOTE     git remote to push to (default gitlab)
#   BRANCH     deploy branch name (default deploy)

set -euo pipefail

SITE_URL="${SITE_URL:-https://hazards.climatefutures-mm.org}"
REMOTE="${REMOTE:-gitlab}"
BRANCH="${BRANCH:-deploy}"
PUSH=0
for arg in "$@"; do
    case "$arg" in
        --push) PUSH=1 ;;
        *) echo "Unknown option: $arg" >&2; exit 1 ;;
    esac
done

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
WORKTREE="$ROOT/.deploy-worktree"
BUILD_DIR="$(mktemp -d)"
trap 'rm -rf "${BUILD_DIR:?}"' EXIT

if [ -n "$(git status --porcelain)" ]; then
    echo "Commit or stash your changes first, so the deploy matches a commit." >&2
    exit 1
fi
SOURCE_COMMIT="$(git rev-parse --short HEAD)"

echo "Building $SOURCE_COMMIT for $SITE_URL"
VITE_SITE_URL="$SITE_URL" npx vite build --outDir "$BUILD_DIR" --emptyOutDir

if [ ! -f "$BUILD_DIR/data/myanmar/townships.geojson" ]; then
    echo "public/data/myanmar/townships.geojson is missing." >&2
    exit 1
fi

# Check out the deploy branch in its own worktree, creating it if needed
git fetch --quiet "$REMOTE" "$BRANCH" 2>/dev/null || true
if [ ! -d "$WORKTREE" ]; then
    if git show-ref --quiet "refs/heads/$BRANCH"; then
        git worktree add --quiet "$WORKTREE" "$BRANCH"
    elif git show-ref --quiet "refs/remotes/$REMOTE/$BRANCH"; then
        git worktree add --quiet -b "$BRANCH" "$WORKTREE" "$REMOTE/$BRANCH"
    else
        git worktree add --quiet --detach "$WORKTREE"
        git -C "$WORKTREE" checkout --quiet --orphan "$BRANCH"
        git -C "$WORKTREE" rm -rf --quiet .
    fi
fi

# Replace the branch contents with the new build
rsync -a --delete --exclude '.git' "$BUILD_DIR/" "$WORKTREE/"
git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
    echo "Nothing changed since the last deploy."
else
    git -C "$WORKTREE" commit --quiet -m "Deploy $SOURCE_COMMIT"
    echo "Committed to $BRANCH: $(git -C "$WORKTREE" log --oneline -1)"
fi

if [ "$PUSH" -eq 1 ]; then
    git -C "$WORKTREE" push "$REMOTE" "$BRANCH"
else
    echo "Not pushed. Run with --push to publish the $BRANCH branch to $REMOTE."
fi
