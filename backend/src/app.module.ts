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
import { ProfessionalOrientationModule } from './professional-orientation/professional-orientation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 4450),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '44504450'),
        database: configService.get('DB_NAME', 'postgres'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}