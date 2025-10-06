// src/course-groups/course-groups.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseGroupsService } from './course-groups.service';
import { CourseGroupsController } from './course-groups.controller';
import { CourseGroup } from './entities/course-group.entity';
import { CourseRegistration } from './entities/course-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseGroup, CourseRegistration])],
  controllers: [CourseGroupsController],
  providers: [CourseGroupsService],
  exports: [CourseGroupsService],
})
export class CourseGroupsModule {}