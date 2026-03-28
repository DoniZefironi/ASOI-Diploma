import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { DeadlineNotificationService } from './deadline-notification.service';
import { Assignment } from '../assignments/entities/assignment.entity';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';
import { AssignmentSubmission } from '../assignments/entities/assignment-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Assignment, CourseRegistration, AssignmentSubmission])],
  controllers: [NotificationsController],
  providers: [NotificationsService, DeadlineNotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
