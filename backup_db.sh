#!/bin/bash

CONTAINER_NAME=asoi_diploma_db
POSTGRES_DB=Curs
POSTGRES_USER=postgres  

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${POSTGRES_DB}_${TIMESTAMP}.sql"

echo "--- Создание резервной копии БД '${POSTGRES_DB}' ---"

if ! docker ps | grep -q $CONTAINER_NAME; then
    echo "Ошибка: Контейнер $CONTAINER_NAME не запущен"
    exit 1
fi

docker exec $CONTAINER_NAME pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Успешно. Дамп сохранён: $BACKUP_FILE"
else
    echo "Ошибка при выполнении pg_dump."
    exit 1
fi