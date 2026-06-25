// src/equipment/equipment.controller.ts
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

import { EquipmentService } from './equipment.service';

@Controller('equipment')
export class EquipmentController {

  constructor(
    private readonly equipmentService: EquipmentService,
  ) {}

  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.equipmentService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Оборудование с ID ${id} не найдено`);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    try {
      return await this.equipmentService.update(id, body);
    } catch (error) {
      throw new NotFoundException(`Оборудование с ID ${id} не найдено`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.equipmentService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Оборудование с ID ${id} не найдено`);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.equipmentService.create(body);
  }
}