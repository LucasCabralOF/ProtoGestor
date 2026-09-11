#!/usr/bin/env bash

set -euo pipefail

rm -f .next/dev/lock

exec npx next dev --hostname 0.0.0.0 --webpack --port "${PLAYWRIGHT_PORT:-3101}"
