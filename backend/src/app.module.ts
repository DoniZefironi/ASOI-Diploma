// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CourseGroupsModule } from './course-groups/course-groups.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { MaterialsModule } from './materials/materials.module';
import { ForumModule } from './forum/forum.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CompilerModule } from './compiler/compiler.module';
import { HackathonsModule } from './hackathons/hackathons.module';
import { CircuitModule } from './circuit/circuit.module';
import { InternshipApplication, InternshipView } from './internships/entities/index';
import { ProfessionalOrientationModule } from './professional-orientation/professional-orientation.module';
import { CourseAccessModule } from './course-access/course-access.module';
import { ElectivesModule } from './electives/electives.module';
import { Elective } from './electives/entities/elective.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { SiteVisit } from './analytics/entities/site-visit.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { VocabTerm } from './vocabulary/entities/vocab-term.entity';
import { RoomsModule } from './rooms/rooms.module';
import { OlympiadsModule } from './olympiads/olympiads.module';
import { Olympiad } from './olympiads/entities/olympiad.entity';
import { OlympiadProblem } from './olympiads/entities/olympiad-problem.entity';
import { OlympiadSubmission } from './olympiads/entities/olympiad-submission.entity';
import { Room } from './rooms/entities/room.entity';
import { RoomMember } from './rooms/entities/room-member.entity';
import { InternshipsModule } from './internships/internships.module';
import { Internship } from './internships/entities/internship.entity';
import { ElectiveEnrollment } from './electives/entities/elective-enrollment.entity';
import { User } from './users/entities/user.entity';
import { UserRole } from './users/entities/user-role.entity';
import { CourseRegistration } from './course-groups/entities/course-registration.entity';
import { AssignmentSubmission } from './assignments/entities/assignment-submission.entity';
import { ForumPost } from './forum/entities/forum-post.entity';
import { UserAchievement } from './achievements/entities/user-achievement.entity';
import { PeerReview } from './assignments/entities/peer-review.entity';
import { CircuitSubmission } from './circuit/entities/circuit-submission.entity';
import { ProfessionalOrientation } from './professional-orientation/entities/professional-orientation.entity';
import { CareerTest } from './professional-orientation/entities/career-test.entity';
import { Assignment } from './assignments/entities/assignment.entity';
import { ForumTopic } from './forum/entities/forum-topic.entity';
import { ForumSection } from './forum/entities/forum-section.entity';
import { Course } from './courses/entities/course.entity';
import { CourseGroup } from './course-groups/entities/course-group.entity';
import { CourseMaterial } from './materials/entities/course-material.entity';
import { Achievement } from './achievements/entities/achievement.entity';
import { ScheduleItem } from './schedule/entities/schedule-item.entity';
import { Hackathon } from './hackathons/entities/hackathon.entity';
import { HackathonTeam } from './hackathons/entities/hackathon-team.entity';
import { HackathonTeamMember } from './hackathons/entities/hackathon-team-member.entity';
import { HackathonSubmission } from './hackathons/entities/hackathon-submission.entity';
import { HackathonGrade } from './hackathons/entities/hackathon-grade.entity';
import { HackathonStage } from './hackathons/entities/hackathon-stage.entity';
import { HackathonTask } from './hackathons/entities/hackathon-task.entity';
import { TaskReviewer } from './hackathons/entities/task-reviewer.entity';
import { TaskGrade } from './hackathons/entities/task-grade.entity';
import { StageSubmission } from './hackathons/entities/stage-submission.entity';
import { CircuitElementType } from './circuit/entities/circuit-element-type.entity';
import { CircuitSolution } from './assignments/entities/circuit-solution.entity';
import { PeerReviewSession } from './assignments/entities/peer-review-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined in environment variables');
        }
        return {
          type: 'postgres', 
          url: databaseUrl,
          entities: [
            User,
            UserRole,
            Course,
            CourseGroup,
            CourseRegistration,
            Assignment,
            AssignmentSubmission,
            PeerReview,
            CircuitSolution,
            ForumTopic,
            ForumPost,
            ForumSection,
            Achievement,
            UserAchievement,
            CircuitSubmission,
            CircuitElementType,
            ProfessionalOrientation,
            CareerTest,
            CourseMaterial,
            ScheduleItem,
            Hackathon,
            HackathonTeam,
            HackathonTeamMember,
            HackathonSubmission,
            HackathonGrade,
            HackathonStage,
            HackathonTask,
            TaskReviewer,
            TaskGrade,
            StageSubmission,
            PeerReviewSession,
            Elective,
            ElectiveEnrollment,
            Internship,
            InternshipApplication,
            InternshipView,
            SiteVisit,
            Notification,
            VocabTerm,
            Room,
            RoomMember,
            Olympiad,
            OlympiadProblem,
            OlympiadSubmission,
          ],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') !== 'production',
        };
      },
      inject: [ConfigService], 
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    CourseGroupsModule,
    ScheduleModule,
    AssignmentsModule,
    MaterialsModule,
    ForumModule,
    AchievementsModule,
    CompilerModule,
    ProfessionalOrientationModule,
    HackathonsModule,
    CircuitModule,
    CourseAccessModule,
    ElectivesModule,
    InternshipsModule,
    AnalyticsModule,
    NotificationsModule,
    VocabularyModule,
    RoomsModule,
    OlympiadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}