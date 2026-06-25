import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe
} from '@nestjs/common';

import { EngineersService } from './engineers.service';

@Controller('engineers')
export class EngineersController {

  constructor(
    private readonly engineersService: EngineersService,
  ) {}

  @Get()
  findAll() {
    return this.engineersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.engineersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.engineersService.findByUserId(userId);
  }

  @Post()
  create(@Body() body: any) {
    return this.engineersService.create(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.engineersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.engineersService.remove(id);
  }
}