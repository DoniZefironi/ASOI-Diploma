// src/materials/materials.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { CourseMaterial } from './entities/course-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseMaterial])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}