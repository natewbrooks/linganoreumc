#!/usr/bin/env bash
# Starts MySQL + API in Docker, then the site (:3000) and admin (:3001) with live reload.
# Usage: ./dev.sh            (frontend + admin)
#        ./dev.sh frontend   (any of: frontend admin)
# Ctrl+C stops the Next dev servers. Containers keep running: `docker compose down` to stop them.
set -euo pipefail
cd "$(dirname "$0")"

docker compose up -d

apps=("${@:-frontend admin}")
pids=()
for app in ${apps[@]}; do
	case "$app" in
		frontend) dir=frontend-next ;;
		admin) dir=admin-next ;;
		*) echo "Unknown app: $app" && exit 1 ;;
	esac
	[ -d "$dir/node_modules" ] || npm --prefix "$dir" install
	npm --prefix "$dir" run dev &
	pids+=($!)
done

trap 'kill ${pids[@]} 2>/dev/null' INT TERM
wait
