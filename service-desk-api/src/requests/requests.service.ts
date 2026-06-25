import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request } from './request.entity';
import { ActionLogService } from '../action-log/action-log.service';

@Injectable()
export class RequestsService {

  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findAll() {
    return this.requestRepository
      .createQueryBuilder('r')
      .leftJoin('clients', 'c', 'c.id_client = r.id_client')
      .leftJoin('equipment', 'e', 'e.id_equipment = r.id_equipment')
      .leftJoin('service_categories', 'cat', 'cat.id_category = r.id_category')
      .leftJoin('statuses', 's', 's.id_status = r.id_status')
      .leftJoin('engineers', 'eng', 'eng.id_engineer = r.id_engineer')
      .select([
        'r.id_request AS id_request',
        'r.title AS title',
        'r.description AS description',
        'r.created_at AS created_at',
        'c.full_name AS client',
        'e.name AS equipment',
        'cat.name AS category',
        's.name AS status',
        'eng.full_name AS engineer_name',
        'r.id_engineer AS engineer_id'
      ])
      .getRawMany();
  }

  async findByClientId(clientId: number) {
    return this.requestRepository
      .createQueryBuilder('r')
      .leftJoin('clients', 'c', 'c.id_client = r.id_client')
      .leftJoin('equipment', 'e', 'e.id_equipment = r.id_equipment')
      .leftJoin('service_categories', 'cat', 'cat.id_category = r.id_category')
      .leftJoin('statuses', 's', 's.id_status = r.id_status')
      .leftJoin('engineers', 'eng', 'eng.id_engineer = r.id_engineer')
      .where('r.id_client = :clientId', { clientId })
      .select([
        'r.id_request AS id_request',
        'r.title AS title',
        'r.description AS description',
        'r.created_at AS created_at',
        'c.full_name AS client',
        'e.name AS equipment',
        'cat.name AS category',
        's.name AS status',
        'eng.full_name AS engineer_name',
        'r.id_engineer AS engineer_id'
      ])
      .getRawMany();
  }

  async findByEngineerId(engineerId: number) {
    return this.requestRepository
      .createQueryBuilder('r')
      .leftJoin('clients', 'c', 'c.id_client = r.id_client')
      .leftJoin('equipment', 'e', 'e.id_equipment = r.id_equipment')
      .leftJoin('service_categories', 'cat', 'cat.id_category = r.id_category')
      .leftJoin('statuses', 's', 's.id_status = r.id_status')
      .leftJoin('engineers', 'eng', 'eng.id_engineer = r.id_engineer')
      .where('r.id_engineer = :engineerId', { engineerId })
      .andWhere('r.id_status != 4') // Не показываем выполненные
      .select([
        'r.id_request AS id_request',
        'r.title AS title',
        'r.description AS description',
        'r.created_at AS created_at',
        'c.full_name AS client',
        'e.name AS equipment',
        'cat.name AS category',
        's.name AS status',
        'eng.full_name AS engineer_name',
        'r.id_engineer AS engineer_id'
      ])
      .getRawMany();
  }

  async getCompletedWorks(engineerId: number) {
    return this.requestRepository
      .createQueryBuilder('r')
      .leftJoin('clients', 'c', 'c.id_client = r.id_client')
      .leftJoin('equipment', 'e', 'e.id_equipment = r.id_equipment')
      .leftJoin('engineers', 'eng', 'eng.id_engineer = r.id_engineer')
      .where('r.id_engineer = :engineerId', { engineerId })
      .andWhere('r.id_status = 4') // Только выполненные
      .select([
        'r.id_request AS request_id',
        'r.title AS description',
        'r.created_at AS date'
      ])
      .orderBy('r.created_at', 'DESC')
      .getRawMany();
  }

  async create(data: any) {
    const newRequest = this.requestRepository.create({
      id_client: data.clientId,
      id_engineer: data.engineerId || null,
      id_equipment: data.equipmentId,
      id_category: data.categoryId,
      id_status: data.statusId || 1,
      title: data.title || 'Без названия',
      description: data.description || 'Без описания',
      created_at: new Date()
    });
    
    const saved = await this.requestRepository.save(newRequest);
    await this.actionLogService.logCreateRequest(data.clientId, saved.id_request);
    return saved;
  }

  async update(id: number, data: any) {
    const request = await this.requestRepository.findOne({
      where: { id_request: id }
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    const updateData: any = {};
    const changes: string[] = [];

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.equipmentId !== undefined) updateData.id_equipment = data.equipmentId;
    if (data.categoryId !== undefined) updateData.id_category = data.categoryId;
    
    if (data.engineer_id !== undefined) {
      updateData.id_engineer = data.engineer_id === 0 ? null : data.engineer_id;
    }
    
    if (data.status !== undefined) {
      const statusMap: Record<string, number> = {
        'Новая': 1,
        'В работе': 2,
        'Ожидание': 3,
        'Выполнена': 4,
        'Закрыта': 5
      };
      const statusId = statusMap[data.status];
      if (statusId) {
        updateData.id_status = statusId;
      }
    }

    console.log('Обновление заявки:', { id, updateData });

    if (Object.keys(updateData).length === 0) {
      return request;
    }

    await this.requestRepository.update(id, updateData);

    return this.requestRepository.findOne({
      where: { id_request: id }
    });
  }

  async patch(id: number, data: any) {
    return this.update(id, data);
  }
}