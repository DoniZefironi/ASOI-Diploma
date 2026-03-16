import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, Patch } from '@nestjs/common';
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

@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Get()
  findAll() {
    return this.hackathonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.findOne(id);
  }

  @Get(':id/rankings')
  getRankings(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.getRankings(id);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getStats() {
    return this.hackathonsService.getStats();
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
  transferLeadership(@Param('teamId', ParseIntPipe) teamId: number, @Body() body: { newLeaderId: number }) {
    return this.hackathonsService.transferLeadership(teamId, body.newLeaderId);
  }

  @Patch('teams/:teamId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  updateTeamStatus(@Param('teamId', ParseIntPipe) teamId: number, @Body() body: { status: string }) {
    return this.hackathonsService.updateTeamStatus(teamId, body.status);
  }

  @Get('my-teams')
  @UseGuards(JwtAuthGuard)
  getUserTeams(@Request() req) {
    return this.hackathonsService.getUserTeams(req.user.userId);
  }

  // ============ Submissions ============

  @Post('submissions')
  @UseGuards(JwtAuthGuard)
  submitProject(@Body() dto: SubmitProjectDto, @Request() req) {
    return this.hackathonsService.submitProject(dto, dto.teamId);
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard)
  getUserSubmissions(@Request() req) {
    return this.hackathonsService.getUserSubmissions(req.user.userId);
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
}
