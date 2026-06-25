// src/spare-parts/spare-parts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SparePart } from './spare-part.entity';

@Injectable()
export class SparePartsService {

  constructor(
    @InjectRepository(SparePart)
    private readonly sparePartRepository: Repository<SparePart>,
  ) {}

  findAll() {
    return this.sparePartRepository.find();
  }

  async findOne(id: number) {
    const item = await this.sparePartRepository.findOne({
      where: { id_part: id }
    });
    if (!item) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }
    return item;
  }

  async update(id: number, data: Partial<SparePart>) {
    await this.findOne(id);
    await this.sparePartRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.sparePartRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Запчасть с ID ${id} не найдена`);
    }
  }

  create(data: Partial<SparePart>) {
    return this.sparePartRepository.save(data);
  }
}