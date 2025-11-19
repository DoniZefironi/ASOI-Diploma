#!/bin/bash
# Скрипт для создания резервной копии базы данных

DB_NAME=${POSTGRES_DB:-asoi_diploma}
DB_USER=${POSTGRES_USER:-asoi_user}
CONTAINER_NAME=asoi_diploma_db

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.sql"

echo "Creating backup of database '$DB_NAME' to $BACKUP_FILE..."

docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi