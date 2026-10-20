# Deploying linganoreumc.com

## Where things live

| What | Where |
| --- | --- |
| Server | DigitalOcean droplet `LINGANORE-CAPROVER` (`137.184.223.190`), 2 GB RAM |
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
