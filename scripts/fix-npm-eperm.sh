#!/usr/bin/env bash
# fix-npm-eperm.sh
# Resolves the common `EPERM: operation not permitted, uv_cwd` error
# that occurs when running `npm install` / `npx serve` inside a
# cloud-synced folder (OneDrive, iCloud, Dropbox, Google Drive) or a
# directory with restrictive permissions.
#
# Usage:   ./scripts/fix-npm-eperm.sh
# Effect:  clears npm caches and stale lockfiles locally; does NOT
#          touch node_modules outside the current directory.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "▶ Working directory: $ROOT_DIR"

# 1. Clear stale lockfile and caches inside the project
rm -f package-lock.json
rm -rf node_modules .npm .uv .uv-cache 2>/dev/null || true

# 2. Clear the user-level npm cache
npm cache clean --force >/dev/null 2>&1 || true

echo "✔ Local caches cleared."
echo
echo "Next steps:"
echo "  1. If this folder is inside OneDrive / iCloud / Dropbox / Google Drive,"
echo "     either pause sync for it or move the project to a non-synced path"
echo "     (e.g. ~/Projects/LandingPage6) and re-run this script there."
echo "  2. On macOS, grant Terminal / VS Code 'Full Disk Access' under"
echo "     System Settings → Privacy & Security."
echo "  3. Then run:"
echo "       npm install"
echo "       npx serve public"