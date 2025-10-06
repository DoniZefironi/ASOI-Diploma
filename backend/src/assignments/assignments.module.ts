// src/assignments/assignments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { PeerReview } from './entities/peer-review.entity';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      AssignmentSubmission,
      PeerReview,
      CourseRegistration
    ])
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}