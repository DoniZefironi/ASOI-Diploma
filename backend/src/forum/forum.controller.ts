// src/forum/forum.controller.ts
import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumSectionDto } from './dto/create-forum-section.dto';
import { CreateForumTopicDto } from './dto/create-forum-topic.dto';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // Sections
  @Get('sections')
  findAllSections() {
    return this.forumService.findAllSections();
  }

  @Get('sections/course/:courseId')
  getSectionsByCourse(@Param('courseId') courseId: string) {
    return this.forumService.getSectionsByCourse(+courseId);
  }

  @Get('sections/:id')
  findSectionById(@Param('id') id: string) {
    return this.forumService.findSectionById(+id);
  }

  @Post('sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  createSection(@Body() createSectionDto: CreateForumSectionDto) {
    return this.forumService.createSection(createSectionDto);
  }

  // Topics
  @Get('topics')
  getRecentTopics(@Query('limit') limit?: string) {
    return this.forumService.getRecentTopics(limit ? +limit : 10);
  }

  @Get('topics/section/:sectionId')
  getTopicsBySection(@Param('sectionId') sectionId: string) {
    return this.forumService.getTopicsBySection(+sectionId);
  }

  @Get('topics/:id')
  findTopicById(@Param('id') id: string) {
    return this.forumService.findTopicById(+id);
  }

  @Post('topics')
  @UseGuards(JwtAuthGuard)
  createTopic(@Body() createTopicDto: CreateForumTopicDto, @Request() req) {
    return this.forumService.createTopic(createTopicDto, req.user.userId);
  }

  @Put('topics/:id/pin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  pinTopic(@Param('id') id: string) {
    return this.forumService.pinTopic(+id);
  }

  @Put('topics/:id/unpin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  unpinTopic(@Param('id') id: string) {
    return this.forumService.unpinTopic(+id);
  }

  @Put('topics/:id/lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  lockTopic(@Param('id') id: string) {
    return this.forumService.lockTopic(+id);
  }

  @Put('topics/:id/unlock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  unlockTopic(@Param('id') id: string) {
    return this.forumService.unlockTopic(+id);
  }

  // Posts
  @Get('topics/:topicId/posts')
  getPostsByTopic(@Param('topicId') topicId: string) {
    return this.forumService.getPostsByTopic(+topicId);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createPostDto: CreateForumPostDto, @Request() req) {
    return this.forumService.createPost(createPostDto, req.user.userId);
  }
}