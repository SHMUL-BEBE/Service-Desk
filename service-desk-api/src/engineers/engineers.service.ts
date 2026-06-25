import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Engineer } from './engineer.entity';

@Injectable()
export class EngineersService {

  constructor(
    @InjectRepository(Engineer)
    private readonly engineerRepository: Repository<Engineer>,
  ) {}

  findAll() {
    return this.engineerRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID инженера должен быть числом');
    }
    const engineer = await this.engineerRepository.findOne({
      where: { id_engineer: id },
      relations: ['user']
    });
    if (!engineer) {
      throw new NotFoundException(`Инженер с ID ${id} не найден`);
    }
    return engineer;
  }

  async findByUserId(userId: number) {
    if (!userId || isNaN(userId)) {
      throw new NotFoundException('ID пользователя должен быть числом');
    }
    return this.engineerRepository.find({
      where: { id_user: userId },
      relations: ['user']
    });
  }

  create(data: Partial<Engineer>) {
    return this.engineerRepository.save(data);
  }

  async update(id: number, data: Partial<Engineer>) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID инженера должен быть числом');
    }
    await this.findOne(id);
    await this.engineerRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotFoundException('ID инженера должен быть числом');
    }
    return this.engineerRepository.delete(id);
  }
}