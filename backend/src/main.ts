import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Обновите CORS для порта 3001
  app.enableCors({
    origin: [
      'http://localhost:3001',  // Добавьте порт 3001
      'http://127.0.0.1:3001',
      'http://localhost:3000',  // Оставьте на всякий случай
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = 2904;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📡 CORS enabled for frontend: http://localhost:3001`);
}

bootstrap();