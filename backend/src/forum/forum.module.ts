// src/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumSection } from './entities/forum-section.entity';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumPost } from './entities/forum-post.entity';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ForumSection,
      ForumTopic,
      ForumPost,
      CourseRegistration
    ])
  ],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}