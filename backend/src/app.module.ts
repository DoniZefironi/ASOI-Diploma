// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Импортируем модули
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
      // envFilePath: '.env', // Убрано, чтобы не читался локальный файл в Docker, если не нужно
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined in environment variables');
        }
        // Явно указываем тип 'postgres' и корректно формируем объект конфигурации
        return {
          type: 'postgres', // <-- Явно указываем тип как строковый литерал 'postgres'
          url: databaseUrl, // <-- Используем строку подключения из DATABASE_URL
          // autoLoadEntities: false, // <-- УБРАНО, так как используем explicit entities
          entities: [
            // Пользователи
            User,
            UserRole,
            // Курсы
            Course,
            CourseGroup,
            CourseRegistration,
            // Задания
            Assignment,
            AssignmentSubmission,
            PeerReview,
            CircuitSolution, // <-- ДОБАВЛЕНО
            // Форум
            ForumTopic,
            ForumPost,
            ForumSection,
            // Достижения
            Achievement,
            UserAchievement,
            // Схемы
            CircuitSubmission,
            CircuitElementType, // <-- ДОБАВЛЕНО
            // Профессиональная ориентация
            ProfessionalOrientation,
            // Материалы
            CourseMaterial,
            // Расписание
            ScheduleItem,
            // Хакатоны
            Hackathon,
            HackathonTeam,
            HackathonTeamMember,
            HackathonProject,
            HackathonGrade,
            HackathonJury,
          ], // <-- Явно указываем все сущности
          // synchronize: false, // Рекомендуется false в продакшене и при использовании миграций
          synchronize: true, // <-- Отключено для безопасности
          logging: configService.get('NODE_ENV') !== 'production',
          // Не указываем host, port, username, password, database отдельно, если используем url
        };
      },
      inject: [ConfigService], // Убедитесь, что ConfigService внедрен
    }),
    // Импортируем остальные модули
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