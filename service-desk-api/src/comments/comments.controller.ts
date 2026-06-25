import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {

  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('request/:requestId')
  findByRequestId(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.commentsService.findByRequestId(requestId);
  }

  @Post()
  create(@Body() body: any) {
    console.log('Получен запрос на создание комментария:', body);
    return this.commentsService.create(body);
  }
}