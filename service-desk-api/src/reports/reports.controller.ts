// src/reports/reports.controller.ts
import {
  Controller,
  Get,
  Res,
  InternalServerErrorException
} from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('requests')
  async getRequestsReport(@Res() res) {
    try {
      const data = await this.reportsService.getRequestsData();
      // Добавляем BOM для UTF-8
      const bom = '\uFEFF';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=requests-report.csv');
      res.send(bom + data);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка генерации отчета по заявкам');
    }
  }

  @Get('engineers')
  async getEngineersReport(@Res() res) {
    try {
      const data = await this.reportsService.getEngineersData();
      const bom = '\uFEFF';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=engineers-report.csv');
      res.send(bom + data);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка генерации отчета по инженерам');
    }
  }

  @Get('parts')
  async getPartsReport(@Res() res) {
    try {
      const data = await this.reportsService.getPartsData();
      const bom = '\uFEFF';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=parts-report.csv');
      res.send(bom + data);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка генерации отчета по запчастям');
    }
  }

  @Get('avg-time')
  async getAvgTimeReport(@Res() res) {
    try {
      const data = await this.reportsService.getAvgTimeData();
      const bom = '\uFEFF';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=avg-time-report.csv');
      res.send(bom + data);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка генерации отчета по времени выполнения');
    }
  }
}