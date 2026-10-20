#!/usr/bin/env bash
# Builds each app's image here, pushes it to Docker Hub, then tells CapRover to deploy it.
# Usage: ./deploy.sh            (frontend + backend)
#        ./deploy.sh admin      (any of: frontend backend admin)
# Needs `docker login` once, and CapRover app tokens in `.deploy.env` (see DEPLOY.md)
set -euo pipefail
cd "$(dirname "$0")"
source .deploy.env

apps=("${@:-frontend backend}")
tag=$(git rev-parse --short HEAD)
for app in ${apps[@]}; do
	case "$app" in
		frontend) dir=frontend-next token=$FRONTEND_TOKEN ;;
		backend) dir=backend token=$BACKEND_TOKEN ;;
		admin) dir=admin-next token=$ADMIN_TOKEN ;;
		*) echo "Unknown app: $app" && exit 1 ;;
	esac
	# Unique tag per commit so CapRover always pulls the new image
	image="natewbrooks/linganoreumc:$app-$tag"
	docker build --platform linux/amd64 -t "$image" "$dir"
	docker push "$image"
	npx -y caprover deploy -u https://captain.captain.linganoreumc.com --appToken "$token" -a "$app" -i "$image"
	# Per-commit tags pile up locally otherwise. Build cache is kept, so the next build stays fast
	docker image rm "$image" >/dev/null
done
