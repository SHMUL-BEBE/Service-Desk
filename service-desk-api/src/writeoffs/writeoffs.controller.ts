// src/writeoffs/writeoffs.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';

import { WriteoffsService } from './writeoffs.service';

@Controller('write-offs')
export class WriteoffsController {

  constructor(
    private readonly writeoffsService: WriteoffsService,
  ) {}

  @Get()
  findAll() {
    return this.writeoffsService.findAll();
  }

  @Get('request/:requestId')
  findByRequestId(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.writeoffsService.findByRequestId(requestId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    console.log('Получен запрос на списание:', body);
    
    if (!body.part_id) {
      throw new BadRequestException('part_id обязателен');
    }
    if (!body.quantity || body.quantity <= 0) {
      throw new BadRequestException('quantity должен быть больше 0');
    }
    if (!body.request_id) {
      throw new BadRequestException('request_id обязателен');
    }

    try {
      const result = await this.writeoffsService.create(body);
      console.log('Списание выполнено:', result);
      return result;
    } catch (error) {
      console.error('Ошибка списания:', error);
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new BadRequestException(message);
    }
  }
}