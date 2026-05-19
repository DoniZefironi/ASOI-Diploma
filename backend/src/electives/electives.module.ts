import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Elective } from './entities/elective.entity';
import { ElectiveEnrollment } from './entities/elective-enrollment.entity';
import { ElectivesService } from './electives.service';
import { ElectivesController } from './electives.controller';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { ScheduleItem } from '../schedule/entities/schedule-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Elective, ElectiveEnrollment, CourseRegistration, Assignment, ScheduleItem])],
  providers: [ElectivesService],
  controllers: [ElectivesController],
  exports: [ElectivesService],
})
export class ElectivesModule {}
