#!/bin/sh
#
# Restore REBAAS from a backup archive created by rebaas-backup.sh.
#
# Usage:
#   sh rebaas-restore.sh ./backups/rebaas-20260101-120000.tar.gz
#   sh rebaas-restore.sh ./backups/rebaas-20260101-120000.tar.gz --replace-env
#

set -e

cd "$(dirname "$0")"

REPLACE_ENV=false
ARCHIVE=""

while [ $# -gt 0 ]; do
    case "$1" in
        --replace-env)
            REPLACE_ENV=true
            shift
            ;;
        -h | --help)
            echo "Usage: $0 <backup.tar.gz> [--replace-env]"
            exit 0
            ;;
        -*)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
        *)
            if [ -z "$ARCHIVE" ]; then
                ARCHIVE="$1"
            else
                echo "Unexpected argument: $1" >&2
                exit 1
            fi
            shift
            ;;
    esac
done

if [ -z "$ARCHIVE" ] || [ ! -f "$ARCHIVE" ]; then
    echo "Usage: $0 <backup.tar.gz> [--replace-env]" >&2
    exit 1
fi

confirm() {
    printf '%s\n' "$1"
    printf 'Type yes to continue: '
    read -r reply
    case "$reply" in
        yes) ;;
        *)
            echo "Canceled."
            exit 1
            ;;
    esac
}

confirm "*** WARNING: This replaces data in the running Postgres database."

BACKUP_ROOT="${REBAAS_BACKUP_DIR:-./backups}"
RESTORE_DIR="$BACKUP_ROOT/.restore-$(date +%s)"
mkdir -p "$RESTORE_DIR"

echo "===> Extracting $ARCHIVE"
tar -xzf "$ARCHIVE" -C "$RESTORE_DIR"

BUNDLE="$(find "$RESTORE_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
if [ -z "$BUNDLE" ] || [ ! -f "$BUNDLE/postgres.dump" ]; then
    echo "ERROR: Archive does not contain postgres.dump" >&2
    rm -rf "$RESTORE_DIR"
    exit 1
fi

if [ "$REPLACE_ENV" = true ] && [ -f "$BUNDLE/env" ]; then
    confirm "This will overwrite $(pwd)/.env with the backup copy."
    cp "$BUNDLE/env" .env
    echo "===> Restored .env from backup"
fi

# shellcheck disable=SC1091
set -a && . ./.env && set +a
POSTGRES_DB="${POSTGRES_DB:-postgres}"

db_cid="$(docker compose ps -q db 2>/dev/null || true)"
if [ -z "$db_cid" ]; then
    echo "ERROR: db service is not running. Start the stack with: sh run.sh start" >&2
    rm -rf "$RESTORE_DIR"
    exit 1
fi

echo "===> Stopping API services (db stays up)"
docker compose stop studio api-gw auth rest meta 2>/dev/null \
    || docker compose stop studio api-gw auth rest meta functions storage realtime supavisor 2>/dev/null \
    || true

echo "===> Restoring Postgres into database: $POSTGRES_DB"
docker compose exec -T db pg_restore -U postgres -d "$POSTGRES_DB" --clean --if-exists --no-owner --role=postgres <"$BUNDLE/postgres.dump"

echo "===> Starting stack"
docker compose up -d --wait

rm -rf "$RESTORE_DIR"

echo ""
echo "Restore complete. Open Studio and verify schemas, auth users, and API health."
