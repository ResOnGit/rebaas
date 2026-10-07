export const BACKUPS_MARKDOWN = `
## What you are protecting

REBAAS keeps every warung instance in **one Postgres database** (one schema per app). Auth users live in \`auth.users\`. API keys and JWT settings live in **\`docker/.env\`** on the server.

A backup archive contains:

- **postgres.dump** — full database (all schemas, RLS, auth users)
- **env** — copy of \`.env\` from backup time
- **manifest.txt** — timestamp and Postgres version

You do not need a separate backup per schema.

## On the server

SSH into the box, then from the \`docker/\` directory:

\`\`\`sh
# Stack must be running
sh run.sh backup

# Optional: drop archives older than 14 days
sh run.sh backup --keep 14
\`\`\`

Archives land in \`docker/backups/rebaas-YYYYMMDD-HHMMSS.tar.gz\` (gitignored on the repo; created on the server).

Custom directory:

\`\`\`sh
REBAAS_BACKUP_DIR=/var/backups/rebaas sh run.sh backup
\`\`\`

## Restore (destructive)

\`\`\`sh
sh run.sh restore ./backups/rebaas-20260101-120000.tar.gz

# New VM: also restore .env from the archive
sh run.sh restore ./backups/rebaas-20260101-120000.tar.gz --replace-env
\`\`\`

Restore replaces database contents. Stop warung traffic first if you can.

## Offsite copy

After each backup, copy the \`.tar.gz\` somewhere else (SFTP, NAS, second disk). The archive includes your \`.env\` and full DB — treat it like production data.

## Automate

Example cron (daily 03:00, keep 30 days):

\`\`\`cron
0 3 * * * cd /opt/rebaas/docker && REBAAS_BACKUP_DIR=/var/backups/rebaas sh rebaas-backup.sh --keep 30 >> /var/log/rebaas-backup.log 2>&1
\`\`\`

## Suggested server folders

\`\`\`text
/opt/rebaas/docker/           # compose + scripts from git or SFTP
/opt/rebaas/docker/.env       # created once from .env.example
/opt/rebaas/docker/volumes/db/data/
/opt/rebaas/docker/backups/   # or /var/backups/rebaas
\`\`\`

## Before stack updates

Back up before \`update.sh\` or major Postgres changes. See [how 2](/project/{{ref}}/how-2) for day-to-day instance work.

Full reference: \`docker/BACKUPS.md\` in the REBAAS git repo.
`.trim()
