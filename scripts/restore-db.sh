#!/bin/bash

# ==============================================
# Database Restore Script
# ==============================================

set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/*.sql.gz
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  Warning: This will overwrite the current database!"
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Get database credentials from .env
source .env

echo "📦 Restoring database from: $BACKUP_FILE"

# Decompress and restore
gunzip -c $BACKUP_FILE | docker-compose exec -T postgres psql \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB}

echo "✅ Database restored successfully!"
