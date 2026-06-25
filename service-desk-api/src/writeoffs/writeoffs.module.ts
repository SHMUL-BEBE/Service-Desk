// src/writeoffs/writeoffs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WriteOff } from './writeoff.entity';
import { WriteoffsController } from './writeoffs.controller';
import { WriteoffsService } from './writeoffs.service';
import { SparePart } from '../spare-parts/spare-part.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WriteOff, SparePart]),
  ],
  controllers: [WriteoffsController],
  providers: [WriteoffsService],
  exports: [WriteoffsService],
})
export class WriteoffsModule {}