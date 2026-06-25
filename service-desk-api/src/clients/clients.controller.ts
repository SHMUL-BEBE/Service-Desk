// src/clients/clients.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus
} from '@nestjs/common';

import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.clientsService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    try {
      return await this.clientsService.update(id, body);
    } catch (error) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.clientsService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.clientsService.create(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.clientsService.login(
      body.login,
      body.password
    );
  }
}