// src/assignments/assignments.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreatePeerReviewDto } from './dto/create-peer-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAllAssignments() {
    return this.assignmentsService.findAllAssignments();
  }

  @Get('course-group/:groupId')
  getCourseGroupAssignments(@Param('groupId') groupId: string) {
    return this.assignmentsService.getCourseGroupAssignments(+groupId);
  }

  @Get(':id')
  findAssignmentById(@Param('id') id: string) {
    return this.assignmentsService.findAssignmentById(+id);
  }

  @Get(':id/submissions')
  getAssignmentSubmissionsList(@Param('id') id: string, @Request() req) {
    // Студенты видят только свои submission, менторы - все
    return this.assignmentsService.getAssignmentSubmissions(+id, req.user.userId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.createAssignment(createAssignmentDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  updateAssignment(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.updateAssignment(+id, updateAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  removeAssignment(@Param('id') id: string) {
    return this.assignmentsService.removeAssignment(+id);
  }

  @Post('submissions')
  createSubmission(@Body() createSubmissionDto: CreateSubmissionDto, @Request() req) {
    return this.assignmentsService.createSubmission(createSubmissionDto, req.user.userId);
  }

  @Get('submissions/my')
  getMySubmissions(@Request() req, @Query('assignmentId') assignmentId?: string) {
    return this.assignmentsService.getUserSubmissions(
      req.user.userId,
      assignmentId ? +assignmentId : undefined
    );
  }

  @Get('submissions/assignment/:assignmentId')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getAssignmentSubmissions(@Param('assignmentId') assignmentId: string) {
    return this.assignmentsService.getAssignmentSubmissions(+assignmentId);
  }

  @Get('submissions/:id')
  getSubmissionById(@Param('id') id: string) {
    return this.assignmentsService.getSubmissionById(+id);
  }

  @Post('peer-reviews')
  createPeerReview(@Body() createPeerReviewDto: CreatePeerReviewDto, @Request() req) {
    return this.assignmentsService.createPeerReview(createPeerReviewDto, req.user.userId);
  }

  @Post('submissions/:id/final-grade')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  calculateFinalGrade(@Param('id') id: string) {
    return this.assignmentsService.calculateFinalGrade(+id);
  }

  @Get('course-group/:groupId/grades')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getCourseGroupGrades(@Param('groupId') groupId: string) {
    return this.assignmentsService.getCourseGroupGrades(+groupId);
  }
}
