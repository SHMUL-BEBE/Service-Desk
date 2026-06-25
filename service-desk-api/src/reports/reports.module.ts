// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Request } from '../requests/request.entity';
import { Engineer } from '../engineers/engineer.entity';
import { WriteOff } from '../writeoffs/writeoff.entity';
import { SparePart } from '../spare-parts/spare-part.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Engineer, WriteOff, SparePart]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}