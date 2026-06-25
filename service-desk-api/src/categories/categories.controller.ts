// src/categories/categories.controller.ts
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

import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {

  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.categoriesService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any
  ) {
    try {
      return await this.categoriesService.update(id, body);
    } catch (error) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.categoriesService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.categoriesService.create(body);
  }
}