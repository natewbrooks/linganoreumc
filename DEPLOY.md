# Deploying linganoreumc.com

## Where things live

| What | Where |
| --- | --- |
| Server | DigitalOcean droplet `LINGANORE-CAPROVER`, 2 GB RAM |
| Droplet terminal | DigitalOcean > Droplets > LINGANORE-CAPROVER > Access > Launch Droplet Console (logs in as `root`) |
| CapRover dashboard | https://captain.captain.linganoreumc.com (CapRover root domain is `captain.linganoreumc.com`) |
| CapRover apps | `frontend` (linganoreumc.com), `backend` (api.linganoreumc.com), `admin` (admin.linganoreumc.com), `mysql-db-db` |
| Public site | https://linganoreumc.com (`frontend-next`) |
| API | https://api.linganoreumc.com (`backend`) |
| Database | CapRover app `mysql-db-db` (service `srv-captain--mysql-db-db`), data on a persistent volume |
| Git branch that is live | `production` |

## Deploy

```
./deploy.sh            # frontend + backend
./deploy.sh admin      # any of: frontend backend admin
```

It builds each image on this machine, pushes it to Docker Hub as `natewbrooks/linganoreumc:<app>-<commit>`, and tells CapRover to deploy it. Pushing to GitHub does not deploy anything.

One-time setup:
1. `docker login`
2. For each app in CapRover: Apps > `<app>` > Deployment > **Enable App Token**. Paste the tokens into `.deploy.env` (gitignored).

Before each deploy, back up the database (droplet terminal):

```
docker exec $(docker ps -qf name=srv-captain--mysql-db-db) sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases' > /root/backup-$(date +%F).sql && ls -lh /root/backup-*.sql
```

Deploys only replace app images. MySQL data and `backend` uploads live on persistent volumes and are untouched. Deploy `backend` whenever API code changed. After deploying, check:
- https://api.linganoreumc.com/events/all/ returns JSON
- https://linganoreumc.com/events and https://linganoreumc.com/calendar show events

## Protecting production data

- `deploy.sh` only deploys `frontend`, `backend` and `admin`. It never touches `mysql-db-db`.
- The only automatic database writes are the nightly recurring-event date update (`backend/scheduler.js`) and creating the `admin` user on first start if it doesn't exist. No deploy runs migrations.
- Never delete the `mysql-db-db` or `backend` apps in CapRover, and never run `docker volume prune` or `docker system prune --volumes`. Those remove the database and uploaded images.
- To roll back an app, CapRover > Apps > `<app>` > Deployment > Version History > pick the previous version > Deploy.
- To restore the database from a backup (overwrites current data):

```
docker exec -i $(docker ps -qf name=srv-captain--mysql-db-db) sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < /root/backup-YYYY-MM-DD.sql
```

## Backend environment variables

Set in CapRover > Apps > `backend` > App Configs. Images never contain `.env` files, so every value must be set here:

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `ADMIN_BOOTSTRAP_PASSWORD`, `API_BASE_URL`, `ADMIN_BASE_URL`, `BASE_URL`, `PORT`

`JWT_SECRET` must be long and random (`openssl rand -hex 32`). The code falls back to a known value when it is missing, which would let anyone forge an admin login. `backend/.env.example` lists the local equivalents.

The frontend and admin get their public URLs from their `Dockerfile`, so they need no environment variables for the build.

## Public images

Docker Hub images (`natewbrooks/linganoreumc`) are public. That is safe as long as they hold nothing the GitHub repo doesn't: every app has a `.dockerignore` that excludes `.env*`, and `backend` also excludes `media`. Secrets only ever live in CapRover App Configs and the gitignored `.deploy.env`.

## When the site breaks

Run these in the droplet terminal.

**Overview: what is running, memory, disk**

```
docker service ls --format "{{.Name}} {{.Replicas}} {{.Image}}"
free -h
df -h /
```

`0/1` replicas means that app is down or crash-looping.

**API says `getaddrinfo ENOTFOUND srv-captain--mysql-db-db`**

MySQL is down. Check why:

```
docker service ps srv-captain--mysql-db-db --no-trunc | head -4
dmesg | grep -i "killed process" | tail -3
```

`exit (137)` or `Out of memory: Killed process (mysqld)` means the droplet ran out of RAM (Docker builds use a lot of it). Fix:

```
docker service update --force srv-captain--mysql-db-db
```

Swap should already exist (`free -h` shows `Swap: 2.0Gi`). If it shows `0B`, add it once:

```
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**Site shows "Application error" or pages render with no events/sermons**

The frontend can't reach the API. Read its logs:

```
docker service logs srv-captain--frontend --tail 50 2>&1 | grep -iE "fail|error|ECONN|ENOTFOUND|timeout"
```

**Memory hogs**

```
docker stats --no-stream --format "{{.Name}} {{.MemUsage}}"
```

## Keeping the server healthy (one-time setup)

Run in the droplet terminal. These keep memory, disk and logs from taking the site down.

**Swap** (done 2026-10-20). Check with `free -h`, it should show `Swap: 2.0Gi`.

**Cap Docker log size.** Container logs otherwise grow until the disk fills. Restarting Docker blips the site for about a minute:

```
[ -f /etc/docker/daemon.json ] && cat /etc/docker/daemon.json || (echo '{"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}' > /etc/docker/daemon.json && systemctl restart docker)
```

If it prints an existing file instead, paste it to Claude to merge the setting in rather than overwriting.

**Weekly cleanup of old images.** Every deploy leaves an image behind. This never touches volumes (database and uploads):

```
echo '0 4 * * 0 root docker image prune -af --filter "until=168h" && docker builder prune -af' > /etc/cron.d/docker-cleanup
```

CapRover also has this built in: Settings > Disk Cleanup.

**Cap each app's memory and CPU** so one runaway app restarts itself instead of starving MySQL. CapRover > Apps > `<app>` > App Configs > Service Update Override, paste, Save & Update:

```
TaskTemplate:
  Resources:
    Limits:
      MemoryBytes: 629145600
      NanoCPUs: 800000000
```

That is 600 MB and 80% of one CPU for `frontend`. Use `402653184` (384 MB) for `admin` and `backend`. Leave `mysql-db-db` uncapped.

**Cap system logs and rotate backups.** Keeps the 7 newest database backups:

```
journalctl --vacuum-size=200M && sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=200M/' /etc/systemd/journald.conf && systemctl restart systemd-journald
echo '0 3 * * * root ls -t /root/backup-*.sql | tail -n +8 | xargs -r rm' > /etc/cron.d/backup-rotate
```

**Alerts.** DigitalOcean > Monitoring > Create Alert Policy for the droplet: CPU > 90%, Memory > 85%, Disk > 80%, emailed to you. DigitalOcean > Monitoring > Uptime > create a check for https://linganoreumc.com. Both are free.

**If memory alerts keep firing,** resize the droplet to 4 GB (Droplets > Resize, CPU and RAM only, about $24/mo).
