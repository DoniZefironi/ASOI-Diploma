import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Assignment } from '../assignments/entities/assignment.entity';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { AssignmentSubmission } from '../assignments/entities/assignment-submission.entity';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './entities/notification.entity';

@Injectable()
export class DeadlineNotificationService {
  private readonly logger = new Logger(DeadlineNotificationService.name);

  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(CourseRegistration)
    private readonly registrationRepo: Repository<CourseRegistration>,
    @InjectRepository(AssignmentSubmission)
    private readonly submissionRepo: Repository<AssignmentSubmission>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkDeadlines() {
    this.logger.log('Checking upcoming deadlines...');
    await this.notifyWindow(23, 25, '24 часа');
    await this.notifyWindow(0.5, 1.5, '1 час');
  }

  private async notifyWindow(hoursMin: number, hoursMax: number, label: string) {
    const now = Date.now();
    const from = new Date(now + hoursMin * 3600 * 1000);
    const to = new Date(now + hoursMax * 3600 * 1000);

    const assignments = await this.assignmentRepo.find({
      where: { deadline: Between(from, to), isActive: true },
    });

    for (const assignment of assignments) {
      if (!assignment.courseGroupId) continue;

      // Students approved in this course group
      const registrations = await this.registrationRepo.find({
        where: { courseGroupId: assignment.courseGroupId, status: RegistrationStatus.APPROVED },
      });

      for (const reg of registrations) {
        // Skip if already submitted
        const submitted = await this.submissionRepo.findOne({
          where: { assignmentId: assignment.id, userId: reg.userId },
        });
        if (submitted) continue;

        const deadline = assignment.deadline.toLocaleString('ru-RU', {
          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
        });

        await this.notificationsService.create(
          reg.userId,
          NotificationType.ASSIGNMENT,
          `⏰ Дедлайн через ${label}`,
          `Задание «${assignment.title}» истекает ${deadline}. Не забудьте сдать работу!`,
          { assignmentId: assignment.id, reminderLabel: label },
        ).catch(() => {});
      }
    }
  }
}
