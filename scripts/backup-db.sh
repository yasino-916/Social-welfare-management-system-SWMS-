#!/usr/bin/env bash
# backup-db.sh
# Creates a timestamped PostgreSQL backup dump (SRS §FR-31)
set -e

source .env 2>/dev/null || true

DB_NAME="${DB_NAME:-poverty_support_db}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_FILE"
pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_FILE"

echo "✓ Backup complete: $BACKUP_FILE"

# Keep only the last 30 backups
ls -t "${BACKUP_DIR}"/backup_*.dump | tail -n +31 | xargs -r rm --
echo "✓ Old backups pruned (kept last 30)"
