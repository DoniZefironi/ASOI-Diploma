-- database/init.sql

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Вставка тестовых пользователей (пароли: admin123, mentor123, student123)
INSERT INTO users (email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt") VALUES
('admin@asoi.edu', '$2b$10$K8L1A5H5J5L5A5H5J5L5A.O5vA5H5J5L5A5H5J5L5A5H5J5L5A5H5J', 'Администратор', 'Системы', true, NOW(), NOW()),
('mentor@asoi.edu', '$2b$10$K8L1A5H5J5L5A5H5J5L5A.O5vA5H5J5L5A5H5J5L5A5H5J5L5A5H5J', 'Иван', 'Петров', true, NOW(), NOW()),
('student@asoi.edu', '$2b$10$K8L1A5H5J5L5A5H5J5L5A.O5vA5H5J5L5A5H5J5L5A5H5J5L5A5H5J', 'Алексей', 'Сидоров', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Вставка ролей
INSERT INTO user_roles ("user_id", role) VALUES
(1, 'admin'),
(2, 'mentor'),
(3, 'student')
ON CONFLICT DO NOTHING;

-- Вставка курсов
INSERT INTO courses (name, type, description, duration, "isActive", "createdAt", "updatedAt") VALUES
('Основы электроники', 'electronics', 'Изучение базовых принципов электроники и схемотехники', 36, true, NOW(), NOW()),
('Программирование на Python', 'computer_science', 'Основы программирования на языке Python', 48, true, NOW(), NOW()),
('Английский для IT', 'english', 'Технический английский для IT-специалистов', 24, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Вставка групп
INSERT INTO course_groups (name, year, semester, "maxStudents", "isActive", "startDate", "endDate", "courseId", "createdAt", "updatedAt") VALUES
('Электроника 2024-1', 2024, 1, 25, true, '2024-09-01', '2024-12-31', 1, NOW(), NOW()),
('Python 2024-1', 2024, 1, 30, true, '2024-09-01', '2024-12-31', 2, NOW(), NOW()),
('Английский 2024-1', 2024, 1, 20, true, '2024-09-01', '2024-12-31', 3, NOW(), NOW())
ON CONFLICT DO NOTHING;