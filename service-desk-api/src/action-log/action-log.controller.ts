import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe
} from '@nestjs/common';

import { ActionLogService } from './action-log.service';

@Controller('action-log')
export class ActionLogController {

  constructor(
    private readonly actionLogService: ActionLogService,
  ) {}

  @Get()
  findAll() {
    return this.actionLogService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.actionLogService.findByUserId(userId);
  }

  @Get('request/:requestId')
  findByRequestId(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.actionLogService.findByRequestId(requestId);
  }

  @Post()
  create(@Body() body: any) {
    return this.actionLogService.create(body.userId, body.action);
  }
}