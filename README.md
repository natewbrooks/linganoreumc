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
3. `cd frontend-next && npm install && npm run dev` for the site, and the same in `admin-next` for the admin panel.

## Deploying

See [DEPLOY.md](DEPLOY.md). In short: `./deploy.sh`.
