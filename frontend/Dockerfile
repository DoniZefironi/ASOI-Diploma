# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package*.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем Next.js приложение (создает .next)
RUN npm run build

# Экспортируем порт (Next.js по умолчанию слушает 3000)
EXPOSE 3000

# Команда запуска (запускает production-сервер)
CMD ["npm", "start"]