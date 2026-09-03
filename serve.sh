#!/usr/bin/env bash
# serve.sh — launch jobmap.
#
# The port is PINNED. File System Access folder grants are keyed to the origin
# including the port, so a stable port is what makes "remember my folder" stick
# between sessions. Pass a different one only if you know why.
#
# 8042 belongs to ORCA. jobmap takes 8043.
set -euo pipefail

PORT="${1:-8043}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="http://localhost:${PORT}"

if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already listening — jobmap may already be running."
  echo "Reload ${URL} rather than starting a second one."
  exit 1
fi

python3 "${HERE}/serve.py" "${PORT}" &
SERVER_PID=$!
trap 'kill ${SERVER_PID} 2>/dev/null || true' EXIT

sleep 1

# Chromium only: the File System Access API does not exist elsewhere.
if ! open -a "Google Chrome" "${URL}" 2>/dev/null; then
  echo "Could not find Google Chrome — opening your default browser."
  echo "jobmap needs Chrome, Edge, Arc or Brave to open local folders."
  open "${URL}" 2>/dev/null || true
fi

echo "jobmap running at ${URL}   (Ctrl+C to stop)"
wait ${SERVER_PID}
