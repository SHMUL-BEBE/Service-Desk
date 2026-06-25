import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RequestsModule } from './requests/requests.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { EquipmentModule } from './equipment/equipment.module';
import { StatusesModule } from './statuses/statuses.module';
import { EngineersModule } from './engineers/engineers.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { WriteoffsModule } from './writeoffs/writeoffs.module';
import { LogsModule } from './logs/logs.module';
import { ActionLogModule } from './action-log/action-log.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    // ============================================
    // НАСТРОЙКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      // ==========================================
      // ВАРИАНТ 1: Через DATABASE_URL (ДЛЯ RAILWAY)
      // ==========================================
      // Используем ! для указания, что значение точно есть
      url: process.env.DATABASE_URL!,
      
      // ==========================================
      // ВАРИАНТ 2: Через отдельные переменные (ДЛЯ ЛОКАЛЬНОЙ РАЗРАБОТКИ)
      // ==========================================
      // Раскомментируйте эти строки и закомментируйте url выше
      /*
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '7285',
      database: process.env.DB_NAME || 'servicedesk',
      */
      
      // ==========================================
      // ОБЩИЕ НАСТРОЙКИ
      // ==========================================
      autoLoadEntities: true,
      synchronize: false, // В ПРОДАКШЕНЕ ВСЕГДА false!
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    
    // ============================================
    // МОДУЛИ
    // ============================================
    RequestsModule,
    UsersModule,
    ClientsModule,
    EquipmentModule,
    StatusesModule,
    EngineersModule,
    CategoriesModule,
    CommentsModule,
    SparePartsModule,
    WriteoffsModule,
    LogsModule,
    ActionLogModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}