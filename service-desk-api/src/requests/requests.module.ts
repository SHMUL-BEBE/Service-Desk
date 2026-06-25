import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Request } from './request.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { ActionLogModule } from '../action-log/action-log.module'; // Добавляем импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    ActionLogModule, // Добавляем
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}