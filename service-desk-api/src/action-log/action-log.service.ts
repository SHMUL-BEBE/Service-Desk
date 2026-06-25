import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionLog } from './action-log.entity';

@Injectable()
export class ActionLogService {

  constructor(
    @InjectRepository(ActionLog)
    private readonly actionLogRepository: Repository<ActionLog>,
  ) {}

  async findAll() {
    return this.actionLogRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByUserId(userId: number) {
    return this.actionLogRepository.find({
      where: { id_user: userId },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByRequestId(requestId: number) {
    return this.actionLogRepository.find({
      where: { action: `Заявка #${requestId}` },
      order: { created_at: 'DESC' }
    });
  }

  async create(userId: number, action: string) {
    const log = this.actionLogRepository.create({
      id_user: userId,
      action: action,
      created_at: new Date()
    });
    return this.actionLogRepository.save(log);
  }

  async logCreateRequest(userId: number, requestId: number) {
    return this.create(userId, `Создание заявки #${requestId}`);
  }

  async logAssignEngineer(userId: number, requestId: number, engineerName: string) {
    return this.create(userId, `Назначение инженера ${engineerName} на заявку #${requestId}`);
  }

  async logStatusChange(userId: number, requestId: number, oldStatus: string, newStatus: string) {
    return this.create(userId, `Изменение статуса заявки #${requestId}: ${oldStatus} → ${newStatus}`);
  }

  async logEditRequest(userId: number, requestId: number, changes: string) {
    return this.create(userId, `Редактирование заявки #${requestId}: ${changes}`);
  }

  async logAddComment(userId: number, requestId: number) {
    return this.create(userId, `Добавлен комментарий к заявке #${requestId}`);
  }
}