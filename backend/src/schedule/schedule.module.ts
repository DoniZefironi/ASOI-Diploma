// src/schedule/schedule.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleItem } from './entities/schedule-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleItem])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}