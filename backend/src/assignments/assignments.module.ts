// src/assignments/assignments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { PeerReview } from './entities/peer-review.entity';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';
import { PeerReviewService } from './peer-review.service';
import { PeerReviewController } from './peer-review.controller';
import { PeerReviewSession } from './entities/peer-review-session.entity';
import { PeerReviewSessionService } from './peer-review-session.service';
import { PeerReviewSessionController } from './peer-review-session.controller';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      AssignmentSubmission,
      PeerReview,
      CourseRegistration,
      PeerReviewSession,
    ]),
    AchievementsModule,
  ],
  controllers: [
    AssignmentsController,
    PeerReviewController,
    PeerReviewSessionController,
  ],
  providers: [
    AssignmentsService,
    PeerReviewService,
    PeerReviewSessionService,
  ],
  exports: [
    AssignmentsService,
    PeerReviewService,
    PeerReviewSessionService,
  ],
})
export class AssignmentsModule {}