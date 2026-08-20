#!/usr/bin/env bash
# restore-db.sh <backup_file>
# Restores a PostgreSQL backup dump (SRS §FR-31)
set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-db.sh <backup_file>"
  echo "Example: ./restore-db.sh database/backups/backup_poverty_support_db_20260818_120000.dump"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

source .env 2>/dev/null || true

DB_NAME="${DB_NAME:-poverty_support_db}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "⚠  This will RESTORE the database '$DB_NAME' from:"
echo "   $BACKUP_FILE"
read -r -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Restore cancelled."
  exit 0
fi

pg_restore \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --clean \
  --if-exists \
  "$BACKUP_FILE"

echo "✓ Database restored from $BACKUP_FILE"
