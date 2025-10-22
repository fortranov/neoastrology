#!/bin/bash

# ==============================================
# Database Backup Script
# ==============================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/astrology_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "📦 Creating database backup..."

# Get database credentials from .env
source .env

# Create backup
docker-compose exec -T postgres pg_dump \
    -U ${POSTGRES_USER} \
    ${POSTGRES_DB} > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
ls -t $BACKUP_DIR/*.sql.gz | tail -n +8 | xargs -r rm

echo "✅ Backup completed successfully!"
