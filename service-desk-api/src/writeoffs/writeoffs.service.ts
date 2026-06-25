// src/writeoffs/writeoffs.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WriteOff } from './writeoff.entity';
import { SparePart } from '../spare-parts/spare-part.entity';

@Injectable()
export class WriteoffsService {

  constructor(
    @InjectRepository(WriteOff)
    private readonly writeoffRepository: Repository<WriteOff>,
    @InjectRepository(SparePart)
    private readonly sparePartRepository: Repository<SparePart>,
  ) {}

  async findAll() {
    return this.writeoffRepository.find({
      order: { id_writeoff: 'DESC' }
    });
  }

  async findByRequestId(requestId: number) {
    return this.writeoffRepository.find({
      where: { request_id: requestId },
      order: { id_writeoff: 'DESC' }
    });
  }

  async create(data: any) {
    console.log('Создание списания с данными:', data);

    if (!data.part_id) {
      throw new BadRequestException('part_id обязателен');
    }
    if (!data.quantity || data.quantity <= 0) {
      throw new BadRequestException('Количество должно быть больше 0');
    }
    if (!data.request_id) {
      throw new BadRequestException('request_id обязателен');
    }

    const part = await this.sparePartRepository.findOne({
      where: { id_part: data.part_id }
    });

    if (!part) {
      throw new NotFoundException(`Запчасть с ID ${data.part_id} не найдена`);
    }

    console.log(`Найдена запчасть: ${part.name}, доступно: ${part.quantity}`);

    if (part.quantity < data.quantity) {
      throw new BadRequestException(
        `Недостаточно запчастей на складе. Доступно: ${part.quantity}, запрошено: ${data.quantity}`
      );
    }

    part.quantity -= data.quantity;
    await this.sparePartRepository.save(part);
    console.log(`Обновлен остаток: ${part.quantity}`);

    const writeoff = this.writeoffRepository.create({
      request_id: data.request_id,
      part_id: data.part_id,
      quantity: data.quantity
    });

    const saved = await this.writeoffRepository.save(writeoff);
    console.log('Списание сохранено:', saved);

    return {
      message: `Списано ${data.quantity} шт. "${part.name}"`,
      writeoff: saved,
      remaining_quantity: part.quantity
    };
  }
}