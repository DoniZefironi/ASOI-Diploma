// src/forum/forum.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumSectionDto } from './dto/create-forum-section.dto';
import { CreateForumTopicDto } from './dto/create-forum-topic.dto';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // ============ Sections ============

  @Get('sections')
  findAllSections() {
    return this.forumService.findAllSections();
  }

  @Get('sections/course/:courseId')
  getSectionsByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.forumService.getSectionsByCourse(courseId);
  }

  @Get('sections/:id')
  findSectionById(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.findSectionById(id);
  }

  @Post('sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  createSection(@Body() createSectionDto: CreateForumSectionDto) {
    return this.forumService.createSection(createSectionDto);
  }

  @Put('sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: Partial<CreateForumSectionDto>,
  ) {
    return this.forumService.updateSection(id, updates);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.deleteSection(id);
  }

  // ============ Topics ============

  @Get('topics/section/:sectionId')
  getTopicsBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.forumService.getTopicsBySection(sectionId);
  }

  @Get('topics/:id')
  findTopicById(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.findTopicById(id);
  }

  @Post('topics')
  @UseGuards(JwtAuthGuard)
  createTopic(@Body() createTopicDto: CreateForumTopicDto, @Request() req) {
    const authorId = req.user.userId;
    return this.forumService.createTopic(createTopicDto, authorId);
  }

  @Put('topics/:id')
  @UseGuards(JwtAuthGuard)
  updateTopic(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: { title?: string; content?: string },
    @Request() req,
  ) {
    const authorId = req.user.userId;
    return this.forumService.updateTopic(id, updates, authorId);
  }

  @Put('topics/:id/pin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  toggleTopicPinned(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.toggleTopicPinned(id);
  }

  @Put('topics/:id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  toggleTopicClosed(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.toggleTopicClosed(id);
  }

  @Delete('topics/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  deleteTopic(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.deleteTopic(id);
  }

  // ============ Posts ============

  @Get('topics/:topicId/posts')
  getPostsByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.forumService.getPostsByTopic(topicId);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createPostDto: CreateForumPostDto, @Request() req) {
    const authorId = req.user.userId;
    return this.forumService.createPost(createPostDto, authorId);
  }

  @Put('posts/:id')
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
    @Request() req,
  ) {
    const authorId = req.user.userId;
    return this.forumService.updatePost(id, content, authorId);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const authorId = req.user.userId;
    const isAdmin = req.user.roles?.includes(UserRoleEnum.ADMIN);
    return this.forumService.deletePost(id, authorId, isAdmin);
  }
}
