# Linganore UMC

Website and admin panel for Linganore United Methodist Church.

| Folder | What | Production |
| --- | --- | --- |
| `frontend-next` | Public site (Next.js) | https://linganoreumc.com |
| `admin-next` | Admin panel (Next.js) | https://admin.linganoreumc.com |
| `backend` | API (Express + MySQL) | https://api.linganoreumc.com |

## Local development

1. Copy `backend/.env.example` to `backend/.env` and `frontend-next/.env.example` to `frontend-next/.env.local`.
2. `docker compose up -d` starts MySQL (port `3306`, seeded from `schema.sql`) and the API (port `5000`, live reload).
3. `./dev.sh` starts the site (`3000`) and admin panel (`3001`) with live reload. It runs step 2 for you.

## Deploying

See [DEPLOY.md](DEPLOY.md). In short: `./deploy.sh`.
