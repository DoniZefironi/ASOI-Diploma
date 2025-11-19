#!/bin/bash
# Скрипт для восстановления базы данных из резервной копии

DB_NAME=${POSTGRES_DB:-asoi_diploma}
DB_USER=${POSTGRES_USER:-asoi_user}
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

CONTAINER_NAME=asoi_diploma_db

echo "Restoring database '$DB_NAME' from $BACKUP_FILE..."

cat $BACKUP_FILE | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

if [ $? -eq 0 ]; then
    echo "Restore successful from: $BACKUP_FILE"
else
    echo "Restore failed!"
    exit 1
fi