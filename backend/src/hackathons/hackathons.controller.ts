import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, Patch, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { HackathonsService } from './hackathons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SubmitProjectDto } from './dto/submit-project.dto';
import { GradeProjectDto } from './dto/grade-project.dto';
import { SearchDto } from '../common/dto/pagination.dto';

@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Get()
  findAll(@Query() searchDto: SearchDto) {
    return this.hackathonsService.findAll(searchDto);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getStats() {
    return this.hackathonsService.getStats();
  }

  @Get('my-teams')
  @UseGuards(JwtAuthGuard)
  getUserTeams(@Request() req) {
    return this.hackathonsService.getUserTeams(req.user.userId);
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard)
  getUserSubmissions(@Request() req) {
    return this.hackathonsService.getUserSubmissions(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.findOne(id);
  }

  @Get(':id/rankings')
  getRankings(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.getRankings(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  create(@Body() dto: CreateHackathonDto) {
    return this.hackathonsService.createHackathon(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateHackathonDto>) {
    return this.hackathonsService.updateHackathon(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.deleteHackathon(id);
  }

  // ============ Teams ============

  @Get('teams/:teamId')
  @UseGuards(JwtAuthGuard)
  getTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.hackathonsService.getTeam(teamId);
  }

  @Post('teams/:teamId/upload-archive')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: '/tmp/uploads/hackathons',
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      const allowed = ['.zip', '.tar', '.gz', '.rar', '.7z'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only archive files are allowed (.zip, .tar, .gz, .rar, .7z)'), false);
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  }))
  async uploadArchive(
    @Param('teamId', ParseIntPipe) teamId: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Проверяем, что пользователь — лидер команды
    const team = await this.hackathonsService.getTeam(teamId);
    if (team.leaderId !== req.user.userId) {
      throw new BadRequestException('Only the team leader can upload the archive');
    }

    const archiveUrl = `/tmp/uploads/hackathons/${file.filename}`;
    return { archiveUrl, originalName: file.originalname, size: file.size };
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard)
  createTeam(@Body() dto: CreateTeamDto, @Request() req) {
    return this.hackathonsService.createTeam(dto, req.user.userId);
  }

  @Post('teams/:teamId/join')
  @UseGuards(JwtAuthGuard)
  joinTeam(@Param('teamId', ParseIntPipe) teamId: number, @Request() req) {
    return this.hackathonsService.joinTeam(teamId, req.user.userId);
  }

  @Post('teams/:teamId/leave')
  @UseGuards(JwtAuthGuard)
  leaveTeam(@Param('teamId', ParseIntPipe) teamId: number, @Request() req) {
    return this.hackathonsService.leaveTeam(teamId, req.user.userId);
  }

  @Patch('teams/:teamId/transfer-leadership')
  @UseGuards(JwtAuthGuard)
  transferLeadership(@Param('teamId', ParseIntPipe) teamId: number, @Body() body: { newLeaderId: number }, @Request() req) {
    return this.hackathonsService.transferLeadership(teamId, body.newLeaderId, req.user.userId);
  }

  @Patch('teams/:teamId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  updateTeamStatus(@Param('teamId', ParseIntPipe) teamId: number, @Body() body: { status: string }) {
    return this.hackathonsService.updateTeamStatus(teamId, body.status);
  }

  // ============ Submissions ============

  @Post('submissions')
  @UseGuards(JwtAuthGuard)
  submitProject(@Body() dto: SubmitProjectDto, @Request() req) {
    return this.hackathonsService.submitProject(dto, dto.teamId, req.user.userId);
  }

  @Get('teams/:teamId/submission')
  @UseGuards(JwtAuthGuard)
  getTeamSubmission(@Param('teamId', ParseIntPipe) teamId: number, @Request() req) {
    return this.hackathonsService.getTeamSubmission(teamId, req.user.userId);
  }

  @Get('teams/:teamId/submission/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getTeamSubmissionForReview(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.hackathonsService.getTeamSubmissionForReview(teamId);
  }

  // ============ Grading ============

  @Post('submissions/:submissionId/grade')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  gradeSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() dto: GradeProjectDto,
    @Request() req
  ) {
    return this.hackathonsService.gradeSubmission(submissionId, req.user.userId, dto);
  }

  // ── Task Reviewers ─────────────────────────────────────────────

  @Post('tasks/:taskId/reviewers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  assignReviewers(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: { userIds: number[] },
  ) {
    return this.hackathonsService.assignReviewers(taskId, body.userIds);
  }

  @Get('tasks/:taskId/reviewers')
  @UseGuards(JwtAuthGuard)
  getTaskReviewers(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.hackathonsService.getTaskReviewers(taskId);
  }

  // ── Task Grades ────────────────────────────────────────────────

  @Post('tasks/:taskId/grades')
  @UseGuards(JwtAuthGuard)
  gradeTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: { teamId: number; score: number; feedback?: string },
    @Request() req,
  ) {
    return this.hackathonsService.gradeTask(taskId, body.teamId, req.user.userId, body.score, body.feedback);
  }

  @Get('tasks/:taskId/grades')
  @UseGuards(JwtAuthGuard)
  getTaskGrades(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.hackathonsService.getTaskGrades(taskId);
  }

  // ── Stage Submissions ──────────────────────────────────────────

  @Post('stages/:stageId/submit')
  @UseGuards(JwtAuthGuard)
  submitStage(
    @Param('stageId', ParseIntPipe) stageId: number,
    @Body() body: { teamId: number; projectUrl: string; note?: string },
  ) {
    return this.hackathonsService.submitStage(stageId, body.teamId, body.projectUrl, body.note);
  }

  @Get('stages/:stageId/submissions')
  @UseGuards(JwtAuthGuard)
  getStageSubmissions(@Param('stageId', ParseIntPipe) stageId: number) {
    return this.hackathonsService.getStageSubmissions(stageId);
  }

  @Get('teams/:teamId/stage-submissions')
  @UseGuards(JwtAuthGuard)
  getTeamStageSubmissions(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.hackathonsService.getTeamStageSubmissions(teamId);
  }

  // ── Scoring ────────────────────────────────────────────────────

  @Get(':hackathonId/teams/:teamId/scores')
  @UseGuards(JwtAuthGuard)
  getTeamScores(
    @Param('hackathonId', ParseIntPipe) hackathonId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.hackathonsService.getTeamScores(hackathonId, teamId);
  }

  @Get(':hackathonId/leaderboard')
  @UseGuards(JwtAuthGuard)
  getLeaderboard(@Param('hackathonId', ParseIntPipe) hackathonId: number) {
    return this.hackathonsService.getHackathonLeaderboard(hackathonId);
  }
}
