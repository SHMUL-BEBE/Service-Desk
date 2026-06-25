// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const item = await this.categoryRepository.findOne({
      where: { id_category: id }
    });
    if (!item) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
    return item;
  }

  async update(id: number, data: Partial<Category>) {
    await this.findOne(id);
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }
  }

  create(data: Partial<Category>) {
    return this.categoryRepository.save(data);
  }
}