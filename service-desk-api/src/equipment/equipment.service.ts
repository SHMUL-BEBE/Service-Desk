// src/equipment/equipment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Equipment } from './equipment.entity';

@Injectable()
export class EquipmentService {

  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  findAll() {
    return this.equipmentRepository.find();
  }

  async findOne(id: number) {
    const item = await this.equipmentRepository.findOne({
      where: { id_equipment: id }
    });
    if (!item) {
      throw new NotFoundException(`Оборудование с ID ${id} не найдено`);
    }
    return item;
  }

  async update(id: number, data: Partial<Equipment>) {
    await this.findOne(id);
    await this.equipmentRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Оборудование с ID ${id} не найдено`);
    }
  }

  create(data: Partial<Equipment>) {
    return this.equipmentRepository.save(data);
  }
}