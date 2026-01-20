import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, Patch } from '@nestjs/common';
import { HackathonsService } from './hackathons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  create(@Body() dto: CreateHackathonDto) {
    return this.hackathonsService.createHackathon(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateHackathonDto>) {
    return this.hackathonsService.updateHackathon(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.deleteHackathon(id);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getStats() {
    return this.hackathonsService.getStats();
  }

  @Patch('teams/:teamId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  approveTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.hackathonsService.approveTeam(teamId);
  }

  @Patch('teams/:teamId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  rejectTeam(@Param('teamId', ParseIntPipe) teamId: number, @Body() body: { reason: string }) {
    return this.hackathonsService.rejectTeam(teamId, body.reason);
  }

  @Post(':hackathonId/jury')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  addJury(@Param('hackathonId', ParseIntPipe) hackathonId: number, @Body() body: { userId: number }) {
    return this.hackathonsService.addJury(hackathonId, body.userId);
  }

  @Delete(':hackathonId/jury/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  removeJury(@Param('hackathonId', ParseIntPipe) hackathonId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.hackathonsService.removeJury(hackathonId, userId);
  }

  @Get(':id/rankings')
  getRankings(@Param('id', ParseIntPipe) id: number) {
    return this.hackathonsService.getRankings(id);
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard)
  createTeam(@Body() dto: CreateTeamDto, @Request() req) {
    return this.hackathonsService.createTeam(dto, req.user.userId);
  }

  @Post('projects/submit')
  @UseGuards(JwtAuthGuard)
  submitProject(@Body() dto: SubmitProjectDto, @Request() req) {
    return this.hackathonsService.submitProject(dto, req.user.userId);
  }

  @Post('projects/:teamId/finalize')
  @UseGuards(JwtAuthGuard)
  finalizeSubmission(@Param('teamId', ParseIntPipe) teamId: number, @Request() req) {
    return this.hackathonsService.finalizeProjectSubmission(teamId, req.user.userId);
  }

  @Post('projects/:projectId/grade')
  @UseGuards(JwtAuthGuard)
  gradeProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: GradeProjectDto,
    @Request() req
  ) {
    return this.hackathonsService.gradeProject(projectId, req.user.userId, dto);
  }
}