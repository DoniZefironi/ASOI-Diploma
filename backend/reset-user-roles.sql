-- Скрипт для сброса таблицы user_roles и enum
-- Выполнить через pgAdmin или psql

DROP TABLE IF EXISTS user_roles CASCADE;

-- TypeORM автоматически пересоздаст таблицу с новым enum при следующем запуске
