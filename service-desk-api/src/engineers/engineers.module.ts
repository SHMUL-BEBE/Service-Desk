import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Engineer } from './engineer.entity';
import { EngineersController } from './engineers.controller';
import { EngineersService } from './engineers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Engineer]),
  ],
  controllers: [EngineersController],
  providers: [EngineersService],
  exports: [EngineersService],
})
export class EngineersModule {}