#!/usr/bin/env bash
# fix-npm-eperm.sh
# Resolves the "EPERM: operation not permitted, uv_cwd" error that npm/npx
# can throw inside the LandingPage6 workspace on macOS.
#
# Common root causes:
#   1. node_modules / .package-lock.json owned by a different user
#      (created earlier via sudo, a different account, or an interrupted install).
#   2. A "Serve" process is still holding a file handle in this directory,
#      preventing npm from changing into it (uv_cwd).
#   3. macOS extended attributes / quarantine flags blocking writes.
#
# This script is idempotent: running it on a healthy workspace is a no-op.

set -euo pipefail

# Resolve the project root as the directory above this script.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." &> /dev/null && pwd)"

echo ">> LandingPage6 npm EPERM fix"
echo ">> Project root: ${PROJECT_ROOT}"

cd "${PROJECT_ROOT}"

# --- 1. Stop any running serve/npx process that may be holding CWD ----------
echo ">> [1/4] Stopping running serve / npx processes (if any)..."
if command -v pkill >/dev/null 2>&1; then
  pkill -f "node_modules/.bin/serve" 2>/dev/null || true
  pkill -f "node_modules/serve/build" 2>/dev/null || true
  pkill -f "npx .* serve" 2>/dev/null || true
  sleep 1
fi

# --- 2. Clear stale node_modules and lockfile (owned by wrong user) ----------
echo ">> [2/4] Removing stale node_modules and lockfile (if present)..."
if [ -d "node_modules" ]; then
  # Use rm -rf first; if EPERM prevents that, fall back to trash via osascript on macOS.
  if ! rm -rf "node_modules" 2>/dev/null; then
    if [[ "$(uname -s)" == "Darwin" ]] && command -v osascript >/dev/null 2>&1; then
      echo "   rm failed (likely ownership) — using Finder Trash fallback."
      osascript -e 'tell application "Finder" to delete POSIX file "'"${PROJECT_ROOT}/node_modules"'"' \
        >/dev/null 2>&1 || true
    else
      echo "   WARN: could not remove node_modules. Run: sudo rm -rf node_modules"
    fi
  fi
fi

# Remove stale lockfiles that often come back as "owned by root".
for f in package-lock.json .package-lock.json npm-shrinkwrap.json; do
  if [ -f "$f" ] && [ ! -w "$f" ]; then
    echo "   $f is not writable — removing."
    rm -f "$f" 2>/dev/null || true
  fi
done

# --- 3. Drop macOS quarantine / extended attributes that block writes -------
if [[ "$(uname -s)" == "Darwin" ]]; then
  echo ">> [3/4] Clearing macOS quarantine / xattrs in project root..."
  if command -v xattr >/dev/null 2>&1; then
    xattr -dr com.apple.quarantine "${PROJECT_ROOT}" 2>/dev/null || true
    xattr -cr "${PROJECT_ROOT}" 2>/dev/null || true
  fi
else
  echo ">> [3/4] Skipping xattr step (non-Darwin host)."
fi

# --- 4. Reinstall dependencies as the current user --------------------------
echo ">> [4/4] Reinstalling dependencies with the current user..."
if command -v npm >/dev/null 2>&1; then
  npm install --no-audit --no-fund --loglevel=error
else
  echo "   ERROR: npm is not on PATH. Install Node.js >= 18 and retry."
  exit 1
fi

# --- 5. Sanity-check the result ---------------------------------------------
echo ""
echo ">> Verifying uv_cwd works..."
node -e "process.chdir(process.cwd()); console.log('cwd OK:', process.cwd());" \
  && echo "   SUCCESS: npm / node can change into ${PROJECT_ROOT}."

echo ""
echo ">> Done. You can now run:"
echo "     npm start"
echo "     npx serve public -l 3000"