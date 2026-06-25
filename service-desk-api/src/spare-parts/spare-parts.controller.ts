// src/spare-parts/spare-parts.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';

import { SparePartsService } from './spare-parts.service';

@Controller('spare-parts')
export class SparePartsController {

  constructor(
    private readonly sparePartsService: SparePartsService,
  ) {}

  @Get()
  findAll() {
    return this.sparePartsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.sparePartsService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    try {
      return await this.sparePartsService.update(id, body);
    } catch (error) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.sparePartsService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.sparePartsService.create(body);
  }
}