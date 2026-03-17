// src/course-groups/course-groups.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseGroupsService } from './course-groups.service';
import { CourseGroupsController } from './course-groups.controller';
import { CourseGroup } from './entities/course-group.entity';
import { CourseRegistration } from './entities/course-registration.entity';
import { AssignmentSubmission } from '../assignments/entities/assignment-submission.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { User } from '../users/entities/user.entity';
import { ScheduleItem } from '../schedule/entities/schedule-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseGroup, CourseRegistration, AssignmentSubmission, Assignment, UserRole, User, ScheduleItem])],
  controllers: [CourseGroupsController],
  providers: [CourseGroupsService],
  exports: [CourseGroupsService],
})
export class CourseGroupsModule {}