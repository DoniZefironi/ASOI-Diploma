// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { ProfessionalOrientationModule } from './professional-orientation/professional-orientation.module';
import { User } from './users/entities/user.entity';
import { UserRole } from './users/entities/user-role.entity';
import { CourseRegistration } from './course-groups/entities/course-registration.entity';
import { AssignmentSubmission } from './assignments/entities/assignment-submission.entity';
import { ForumPost } from './forum/entities/forum-post.entity';
import { UserAchievement } from './achievements/entities/user-achievement.entity';
import { PeerReview } from './assignments/entities/peer-review.entity';
import { CircuitSubmission } from './circuit/entities/circuit-submission.entity';
import { ProfessionalOrientation } from './professional-orientation/entities/professional-orientation.entity';
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
import { CircuitElementType } from './circuit/entities/circuit-element-type.entity';
import { CircuitSolution } from './assignments/entities/circuit-solution.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
            CourseMaterial,
            ScheduleItem,
            Hackathon,
            HackathonTeam,
            HackathonTeamMember,
            HackathonSubmission,
            HackathonGrade,
          ],
          synchronize: true, 
          logging: configService.get('NODE_ENV') !== 'production',
        };
      },
      inject: [ConfigService], 
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}