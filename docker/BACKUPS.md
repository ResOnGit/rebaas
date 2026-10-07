# REBAAS backups

Warung data lives in **one Postgres database** (all instance schemas). API keys and JWT settings live in **`docker/.env`** on the server. Back up both together so you can rebuild after disk failure or a bad migration.

## What gets backed up

Each run creates a gzip archive under `docker/backups/` (gitignored):

| File in archive | Purpose |
| --- | --- |
| `postgres.dump` | Full database (`pg_dump` custom format): schemas, `auth.users`, RLS, everything |
| `env` | Copy of the server `.env` at backup time (anon/service keys, `JWT_SECRET`, `PGRST_DB_SCHEMAS`, etc.) |
| `manifest.txt` | Timestamp and Postgres version |

No separate backup is needed per warung schema if they all live in this database.

## Commands

From the `docker/` directory on the server:

```sh
# Create a backup (stack must be running)
sh run.sh backup

# Keep only the last 14 days of archives on disk
sh run.sh backup --keep 14

# Restore (destructive — replaces DB contents)
sh run.sh restore ./backups/rebaas-20260101-120000.tar.gz

# Also overwrite docker/.env from the archive (use when rebuilding a new VM)
sh run.sh restore ./backups/rebaas-20260101-120000.tar.gz --replace-env
```

Custom backup directory:

```sh
REBAAS_BACKUP_DIR=/var/backups/rebaas sh run.sh backup
```

## Suggested server layout

Before `docker compose up -d`, plan paths on the Debian box:

```text
/opt/rebaas/
  docker/                 # compose, volumes, scripts (from git or SFTP)
  docker/.env             # secrets — never commit; copy from .env.example once
  docker/volumes/db/data/ # Postgres data (created on first boot)
  docker/backups/         # local archives from run.sh backup
```

**SFTP / rsync for deploy:** copy the `docker/` tree (without `volumes/db/data` on a fresh install). Generate or copy `.env` on the server. Build or load the REBAAS Studio image separately.

**Offsite:** after each backup, copy `docker/backups/rebaas-*.tar.gz` to another machine, NAS, or object storage. Treat archives like secrets — they contain `.env` and full DB contents.

## Automate (cron)

Example daily backup at 03:00, keep 30 days:

```cron
0 3 * * * cd /opt/rebaas/docker && REBAAS_BACKUP_DIR=/var/backups/rebaas sh rebaas-backup.sh --keep 30 >> /var/log/rebaas-backup.log 2>&1
```

Run a restore drill on a test machine occasionally.

## What this does not replace

- **Postgres volume snapshot** at the hypervisor/block level (optional extra safety).
- **Studio image rebuild** after UI code changes — back up data + `.env`; rebuild the Studio Docker image from the repo when you deploy UI updates.
- **Resend / DNS** — mail config is in GoTrue env vars inside `.env`; included when you back up `env`.

## Related

- Stack updates: `docker/README.md` (back up before `update.sh`).
- In-app guide: Studio main sidebar → **Backups** (below **Authentication**).
