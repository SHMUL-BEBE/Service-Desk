import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Создаём приложение
  const app = await NestFactory.create(AppModule);

  // ============================================
  // НАСТРОЙКА CORS (для фронтенда)
  // ============================================
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ============================================
  // ПОРТ (из переменных окружения)
  // ============================================
  // Railway даёт порт через переменную PORT
  // Для локальной разработки используем 3000
  const port = process.env.PORT || 3000;

  // Запускаем сервер
  await app.listen(port);

  // Выводим информацию в консоль
  console.log(`Сервер запущен на порту ${port}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS разрешён для: ${process.env.CORS_ORIGIN || '*'}`);
}

bootstrap();