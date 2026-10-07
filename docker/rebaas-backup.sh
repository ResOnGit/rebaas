#!/bin/sh
#
# Create a REBAAS backup: Postgres (custom-format pg_dump) + server .env + manifest.
# Output: ./backups/rebaas-YYYYMMDD-HHMMSS.tar.gz (gitignored)
#
# Usage:
#   sh rebaas-backup.sh
#   REBAAS_BACKUP_DIR=/var/backups/rebaas sh rebaas-backup.sh
#   sh rebaas-backup.sh --keep 14
#

set -e

cd "$(dirname "$0")"

KEEP_DAYS=""
while [ $# -gt 0 ]; do
    case "$1" in
        --keep)
            [ $# -ge 2 ] || {
                echo "Usage: $0 [--keep <days>]" >&2
                exit 1
            }
            KEEP_DAYS="$2"
            shift 2
            ;;
        -h | --help)
            echo "Usage: $0 [--keep <days>]"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

if [ ! -f .env ]; then
    echo "ERROR: .env not found in $(pwd). Copy .env.example and configure it first." >&2
    exit 1
fi

# shellcheck disable=SC1091
set -a && . ./.env && set +a

POSTGRES_DB="${POSTGRES_DB:-postgres}"
BACKUP_ROOT="${REBAAS_BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
WORK_DIR="$BACKUP_ROOT/rebaas-$TIMESTAMP"
ARCHIVE="$BACKUP_ROOT/rebaas-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_ROOT"

db_cid="$(docker compose ps -q db 2>/dev/null || true)"
if [ -z "$db_cid" ]; then
    echo "ERROR: db service is not running. Start the stack with: sh run.sh start" >&2
    exit 1
fi

mkdir -p "$WORK_DIR"

echo "===> Dumping Postgres database: $POSTGRES_DB"
docker compose exec -T db pg_dump -U postgres -Fc "$POSTGRES_DB" >"$WORK_DIR/postgres.dump"

echo "===> Copying compose .env (required to restore API keys and JWT settings)"
cp .env "$WORK_DIR/env"

echo "===> Writing manifest"
{
    echo "created_utc=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u)"
    echo "postgres_db=$POSTGRES_DB"
    docker compose exec -T db psql -U postgres -tAc "SELECT version();" 2>/dev/null | sed 's/^/postgres_version=/'
} >"$WORK_DIR/manifest.txt"

echo "===> Creating archive: $ARCHIVE"
tar -czf "$ARCHIVE" -C "$BACKUP_ROOT" "rebaas-$TIMESTAMP"
rm -rf "$WORK_DIR"

if [ -n "$KEEP_DAYS" ]; then
    echo "===> Pruning backups older than ${KEEP_DAYS} days in $BACKUP_ROOT"
    find "$BACKUP_ROOT" -maxdepth 1 -name 'rebaas-*.tar.gz' -type f -mtime +"$KEEP_DAYS" -print -delete
fi

echo ""
echo "Backup complete."
echo "  Archive: $ARCHIVE"
echo "  Offsite: copy this file somewhere safe (SFTP, object storage, second disk)."
echo "  Restore: sh run.sh restore $ARCHIVE"
