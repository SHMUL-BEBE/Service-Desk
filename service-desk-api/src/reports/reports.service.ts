// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request } from '../requests/request.entity';
import { Engineer } from '../engineers/engineer.entity';
import { WriteOff } from '../writeoffs/writeoff.entity';
import { SparePart } from '../spare-parts/spare-part.entity';

@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Engineer)
    private readonly engineerRepository: Repository<Engineer>,
    @InjectRepository(WriteOff)
    private readonly writeOffRepository: Repository<WriteOff>,
    @InjectRepository(SparePart)
    private readonly sparePartRepository: Repository<SparePart>,
  ) {}

  // ==============================
  // 1. ОТЧЕТ ПО ЗАЯВКАМ
  // ==============================
  async getRequestsData(): Promise<string> {
    const totalRequests = await this.requestRepository.count();
    const newRequests = await this.requestRepository.count({ where: { id_status: 1 } });
    const inProgress = await this.requestRepository.count({ where: { id_status: 2 } });
    const waiting = await this.requestRepository.count({ where: { id_status: 3 } });
    const completed = await this.requestRepository.count({ where: { id_status: 4 } });
    const closed = await this.requestRepository.count({ where: { id_status: 5 } });

    const date = new Date().toLocaleDateString('ru-RU');
    const time = new Date().toLocaleTimeString('ru-RU');

    return [
      'ОТЧЕТ ПО ЗАЯВКАМ',
      '',
      `Дата: ${date} ${time}`,
      '',
      'СТАТИСТИКА ЗАЯВОК:',
      `  Всего заявок      : ${totalRequests}`,
      `  Новые             : ${newRequests}`,
      `  В работе          : ${inProgress}`,
      `  Ожидание          : ${waiting}`,
      `  Выполненные       : ${completed}`,
      `  Закрытые          : ${closed}`,
      '',
      `ИТОГО ОБРАБОТАНО: ${completed + closed}`,
      '',
      `Отчет сгенерирован: ${date} ${time}`
    ].join('\n');
  }

  // ==============================
  // 2. ОТЧЕТ ПО ИНЖЕНЕРАМ
  // ==============================
  async getEngineersData(): Promise<string> {
    const engineers = await this.engineerRepository.find({
      relations: ['user']
    });

    const date = new Date().toLocaleDateString('ru-RU');
    const time = new Date().toLocaleTimeString('ru-RU');

    let rows = [
      'ОТЧЕТ ПО ЗАГРУЗКЕ ИНЖЕНЕРОВ',
      '',
      `Дата: ${date} ${time}`,
      '',
      'ИНЖЕНЕРЫ:'
    ];

    let totalActive = 0;
    let totalAll = 0;
    let totalCompleted = 0;

    for (const engineer of engineers) {
      const activeRequests = await this.requestRepository.count({
        where: { 
          id_engineer: engineer.id_engineer,
          id_status: 2
        }
      });
      
      const totalForEngineer = await this.requestRepository.count({
        where: { id_engineer: engineer.id_engineer }
      });

      const completedForEngineer = await this.requestRepository.count({
        where: { 
          id_engineer: engineer.id_engineer,
          id_status: 4
        }
      });

      totalActive += activeRequests;
      totalAll += totalForEngineer;
      totalCompleted += completedForEngineer;

      const loadPercent = totalForEngineer > 0 ? Math.round((activeRequests / totalForEngineer) * 100) : 0;

      const name = engineer.full_name || 'Не указан';
      const spec = engineer.specialization || 'Общая';

      rows.push(
        `${name} (${spec})`
      );
      rows.push(`  Активных заявок  : ${activeRequests}`);
      rows.push(`  Всего заявок     : ${totalForEngineer}`);
      rows.push(`  Выполнено        : ${completedForEngineer}`);
      rows.push(`  Загрузка         : ${loadPercent}%`);
      rows.push('');
    }

    rows.push(
      `ИТОГО по всем инженерам:`,
      `  Активных заявок  : ${totalActive}`,
      `  Всего заявок     : ${totalAll}`,
      `  Выполнено        : ${totalCompleted}`,
      '',
      `Отчет сгенерирован: ${date} ${time}`
    );

    return rows.join('\n');
  }

  // ==============================
  // 3. ОТЧЕТ ПО ЗАПЧАСТЯМ (ТОП-10)
  // ==============================
  async getPartsData(): Promise<string> {
    const writeOffs = await this.writeOffRepository
      .createQueryBuilder('w')
      .select('w.part_id, SUM(w.quantity) as total_quantity')
      .groupBy('w.part_id')
      .orderBy('total_quantity', 'DESC')
      .limit(10)
      .getRawMany();

    const date = new Date().toLocaleDateString('ru-RU');
    const time = new Date().toLocaleTimeString('ru-RU');

    let rows = [
      'ОТЧЕТ ПО РАСХОДУ ЗАПЧАСТЕЙ (ТОП-10)',
      '',
      `Дата: ${date} ${time}`,
      '',
      'СПИСОК ЗАПЧАСТЕЙ:'
    ];

    let rank = 1;
    let totalQuantity = 0;
    let totalCost = 0;
    
    for (const item of writeOffs) {
      const part = await this.sparePartRepository.findOne({
        where: { id_part: item.part_id }
      });
      
      const name = part ? part.name : 'Неизвестная запчасть';
      const price = part ? Number(part.price) : 0;
      const quantity = Number(item.total_quantity);
      const cost = price * quantity;
      
      totalQuantity += quantity;
      totalCost += cost;
      
      rows.push(
        `${rank}. ${name}`
      );
      rows.push(`   Списано: ${quantity} шт.`);
      rows.push(`   Цена за шт.: ${price.toFixed(2)} руб.`);
      rows.push(`   Общая стоимость: ${cost.toFixed(2)} руб.`);
      rows.push('');
      rank++;
    }

    if (writeOffs.length === 0) {
      rows.push('Нет данных о списании запчастей');
    }

    rows.push(
      `ИТОГО:`,
      `  Всего списано: ${totalQuantity} шт.`,
      `  Общая стоимость: ${totalCost.toFixed(2)} руб.`,
      `  Количество наименований: ${writeOffs.length}`,
      '',
      `Отчет сгенерирован: ${date} ${time}`
    );

    return rows.join('\n');
  }

  // ==============================
  // 4. ОТЧЕТ ПО СРЕДНЕМУ ВРЕМЕНИ
  // ==============================
  async getAvgTimeData(): Promise<string> {
    const engineers = await this.engineerRepository.find();

    const date = new Date().toLocaleDateString('ru-RU');
    const time = new Date().toLocaleTimeString('ru-RU');

    let rows = [
      'СРЕДНЕЕ ВРЕМЯ ВЫПОЛНЕНИЯ ЗАЯВОК',
      '',
      `Дата: ${date} ${time}`,
      '',
      'ИНЖЕНЕРЫ:'
    ];

    let totalRequests = 0;
    let totalAvgDays = 0;

    for (const engineer of engineers) {
      const completedRequests = await this.requestRepository.find({
        where: { 
          id_engineer: engineer.id_engineer,
          id_status: 4
        }
      });

      const name = engineer.full_name || 'Не указан';
      const count = completedRequests.length;
      
      rows.push(`${name}:`);
      
      if (count === 0) {
        rows.push(`  Выполненных заявок: 0`);
        rows.push(`  Среднее время: —`);
      } else {
        let totalDaysForEngineer = 0;
        for (const req of completedRequests) {
          const created = new Date(req.created_at);
          const now = new Date();
          const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          totalDaysForEngineer += Math.max(days, 1);
        }

        const avgDays = Math.round(totalDaysForEngineer / count);
        totalRequests += count;
        totalAvgDays += avgDays;

        rows.push(`  Выполненных заявок: ${count}`);
        rows.push(`  Среднее время: ${avgDays} дней`);
      }
      rows.push('');
    }

    const avgAll = totalRequests > 0 ? Math.round(totalAvgDays / engineers.length) : 0;

    rows.push(
      `ИТОГО по всем инженерам:`,
      `  Всего выполненных заявок: ${totalRequests}`,
      `  Среднее время выполнения: ${avgAll} дней`,
      '',
      `Отчет сгенерирован: ${date} ${time}`
    );

    return rows.join('\n');
  }
}