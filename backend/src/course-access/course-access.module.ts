import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAccessService } from './course-access.service';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseRegistration]),
  ],
  providers: [CourseAccessService],
  exports: [CourseAccessService],
})
export class CourseAccessModule {}
