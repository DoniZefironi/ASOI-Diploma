-- database/init.sql

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблиц форума

CREATE TABLE IF NOT EXISTS forum_sections (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_topics (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES forum_sections(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_closed BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_forum_sections_course ON forum_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_section ON forum_topics(section_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);

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

-- Вставка разделов форума
INSERT INTO forum_sections (course_id, title, description, order_index, is_active) VALUES
(1, 'Обсуждение электроники', 'Вопросы и обсуждения по курсу "Основы электроники"', 1, true),
(2, 'Программирование на Python', 'Обсуждение задач, проектов и вопросов по Python', 2, true),
(3, 'Английский язык', 'Общий раздел для обсуждения английского языка', 3, true),
(1, 'Лабораторные работы', 'Обсуждение лабораторных работ по электронике', 4, true),
(NULL, 'Общий раздел', 'Свободное общение на любые темы', 0, true)
ON CONFLICT DO NOTHING;

-- Вставка тем форума
INSERT INTO forum_topics (section_id, author_id, title, content, is_pinned, is_closed, views_count, created_at) VALUES
(1, 1, 'Правила раздела электроники', 'Пожалуйста, задавайте вопросы по теме и используйте поиск перед созданием новой темы.', true, true, 150, NOW()),
(1, 2, 'Как рассчитать сопротивление резистора?', 'Подскажите формулу для расчёта сопротивления при последовательном соединении.', false, false, 45, NOW()),
(2, 3, 'Вопрос по декораторам в Python', 'Не могу понять, как работают декораторы с параметрами. Объясните, пожалуйста.', false, false, 32, NOW()),
(2, 1, 'Домашнее задание №3', 'Обсуждение третьего домашнего задания по курсу Python.', true, false, 89, NOW()),
(5, 2, 'Приветственное сообщение', 'Добро пожаловать на наш форум! Представьтесь и расскажите о себе.', true, false, 200, NOW())
ON CONFLICT DO NOTHING;

-- Вставка сообщений форума
INSERT INTO forum_posts (topic_id, author_id, content, is_edited, created_at) VALUES
(1, 1, 'Правила нашего раздела: 1. Уважайте других участников. 2. Задавайте вопросы по теме. 3. Используйте поиск.', false, NOW()),
(2, 2, 'Закон Ома: I = U/R. Для последовательного соединения Rобщ = R1 + R2 + ... + Rn.', false, NOW()),
(2, 3, 'Спасибо большое! Теперь понял.', false, NOW()),
(3, 1, 'Декоратор - это функция, которая принимает другую функцию. Пример: @decorator def func(): ...', false, NOW()),
(3, 3, 'А как передать параметры в декоратор?', false, NOW()),
(3, 1, 'Нужно создать декоратор с вложенной функцией. def decorator(arg): def inner(func): ... return inner', false, NOW()),
(5, 2, 'Всем привет! Меня зовут Иван, я ментор курса по Python.', false, NOW()),
(5, 3, 'Привет! Я Алексей, студент.', false, NOW())
ON CONFLICT DO NOTHING;

-- ============ ХАКАТОНЫ ============

-- Таблица хакатонов
CREATE TABLE IF NOT EXISTS hackathons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme VARCHAR(200),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP,
  max_team_size INTEGER DEFAULT 5,
  min_team_size INTEGER DEFAULT 3,
  prize_pool DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  judging_criteria JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица команд хакатона
CREATE TABLE IF NOT EXISTS hackathon_teams (
  id SERIAL PRIMARY KEY,
  hackathon_id INTEGER NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  leader_id INTEGER NOT NULL REFERENCES users(id),
  project_name VARCHAR(200),
  project_description TEXT,
  status VARCHAR(50) DEFAULT 'forming',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица участников команды
CREATE TABLE IF NOT EXISTS hackathon_team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES hackathon_teams(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Таблица проектов/подач
CREATE TABLE IF NOT EXISTS hackathon_submissions (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES hackathon_teams(id) ON DELETE CASCADE,
  circuit_project_id INTEGER,
  documentation_url VARCHAR(500),
  presentation_url VARCHAR(500),
  video_demo_url VARCHAR(500),
  source_code_url VARCHAR(500),
  submission_note TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Таблица оценок жюри
CREATE TABLE IF NOT EXISTS hackathon_grades (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES hackathon_submissions(id) ON DELETE CASCADE,
  judge_id INTEGER NOT NULL REFERENCES users(id),
  innovation_score DECIMAL(5,2),
  functionality_score DECIMAL(5,2),
  presentation_score DECIMAL(5,2),
  teamwork_score DECIMAL(5,2),
  total_score DECIMAL(5,2),
  feedback TEXT,
  judging_criteria_scores JSONB,
  judged_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для хакатонов
CREATE INDEX IF NOT EXISTS idx_hackathons_course ON hackathons(course_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_teams_hackathon ON hackathon_teams(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_teams_leader ON hackathon_teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_team_members_team ON hackathon_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_team_members_user ON hackathon_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_submissions_team ON hackathon_submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_grades_submission ON hackathon_grades(submission_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_grades_judge ON hackathon_grades(judge_id);

-- Тестовые хакатоны
INSERT INTO hackathons (course_id, title, description, theme, start_date, end_date, registration_deadline, max_team_size, min_team_size, prize_pool, is_active) VALUES
(2, 'Python Hackathon 2024', 'Ежегодный хакатон по разработке Python приложений', 'AI и машинное обучение', '2024-12-01 09:00:00', '2024-12-03 18:00:00', '2024-11-28 23:59:59', 5, 3, 100000, true),
(1, 'Electronics Challenge', 'Соревнование по разработке электронных устройств', 'Умный дом', '2024-12-10 09:00:00', '2024-12-12 18:00:00', '2024-12-08 23:59:59', 4, 2, 75000, true),
(NULL, 'Student Startup Battle', 'Хакатон для студентов всех направлений', 'Стартапы и инновации', '2025-01-15 09:00:00', '2025-01-17 18:00:00', '2025-01-10 23:59:59', 5, 3, 150000, true)
ON CONFLICT DO NOTHING;