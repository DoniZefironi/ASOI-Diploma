#!/bin/bash

CONTAINER_NAME=asoi_diploma_db
POSTGRES_DB=Curs
POSTGRES_USER=postgres  

# Проверяем, передан ли аргумент с именем файла
if [ $# -eq 0 ]; then
    echo "Ошибка: Укажите файл резервной копии"
    echo "Использование: $0 <backup_file.sql>"
    echo "Пример: $0 backup_Curs_20251121_214637.sql"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Ошибка: Файл резервной копии '$BACKUP_FILE' не найден."
    exit 1
fi

echo "--- Восстановление БД '${POSTGRES_DB}' из $BACKUP_FILE ---"
cat "$BACKUP_FILE" | docker exec -i $CONTAINER_NAME psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

if [ $? -eq 0 ]; then
    echo "Восстановление завершено успешно."
else
    echo "Ошибка восстановления!"
    exit 1
fi