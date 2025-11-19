// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
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

// Импортируем ВСЕ сущности
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

// Forum entities
import { ForumTopic } from './forum/entities/forum-topic.entity';
import { ForumSection } from './forum/entities/forum-section.entity';

// Other entities
import { Course } from './courses/entities/course.entity';
import { CourseGroup } from './course-groups/entities/course-group.entity';
import { CourseMaterial } from './materials/entities/course-material.entity';
import { Achievement } from './achievements/entities/achievement.entity';
import { ScheduleItem } from './schedule/entities/schedule-item.entity';

// Hackathon entities
import { Hackathon } from './hackathons/entities/hackathon.entity';
import { HackathonTeam } from './hackathons/entities/hackathon-team.entity';
import { HackathonTeamMember } from './hackathons/entities/hackathon-team-member.entity';
import { HackathonProject } from './hackathons/entities/hackathon-project.entity';
import { HackathonGrade } from './hackathons/entities/hackathon-grade.entity';
import { HackathonJury } from './hackathons/entities/hackathon-jury.entity';

// Circuit entities
import { CircuitElementType } from './circuit/entities/circuit-element-type.entity';

// Assignments entities
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
            // Users
            User,
            UserRole,
            
            // Courses
            Course,
            CourseGroup,
            CourseRegistration,
            
            // Assignments
            Assignment,
            AssignmentSubmission,
            PeerReview,
            CircuitSolution, // <-- ДОБАВЬТЕ ЭТО
            
            // Forum
            ForumTopic,
            ForumPost,
            ForumSection,
            
            // Achievements
            Achievement,
            UserAchievement,
            
            // Circuit
            CircuitSubmission,
            CircuitElementType, // <-- ДОБАВЬТЕ ЭТО
            
            // Professional Orientation
            ProfessionalOrientation,
            
            // Materials
            CourseMaterial,
            
            // Schedule
            ScheduleItem,
            
            // Hackathons
            Hackathon,
            HackathonTeam,
            HackathonTeamMember,
            HackathonProject,
            HackathonGrade,
            HackathonJury,
          ],
          autoLoadEntities: false,
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