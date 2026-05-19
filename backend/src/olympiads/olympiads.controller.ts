import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { OlympiadsService } from './olympiads.service';
import { CreateOlympiadDto } from './dto/create-olympiad.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { SubmitSolutionDto } from './dto/submit-solution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { SubmissionStatus } from './entities/olympiad-submission.entity';

const MENTOR_ROLES = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.MENTOR_ENGLISH,
  UserRoleEnum.MENTOR_ELECTRONICS,
  UserRoleEnum.MENTOR_COMPUTER_SCIENCE,
  UserRoleEnum.MENTOR_IOT,
];

@Controller('olympiads')
export class OlympiadsController {
  constructor(private readonly svc: OlympiadsService) {}

  // ── Public (auth required) ─────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { return this.svc.findAll(); }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  findAllAdmin() { return this.svc.findAllAdmin(); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Get(':id/leaderboard')
  @UseGuards(JwtAuthGuard)
  leaderboard(@Param('id', ParseIntPipe) id: number) { return this.svc.getLeaderboard(id); }

  @Get(':id/my-submissions')
  @UseGuards(JwtAuthGuard)
  mySubmissions(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.svc.getMySubmissions(id, req.user.userId);
  }

  @Post(':olympiadId/problems/:problemId/submit')
  @UseGuards(JwtAuthGuard)
  submit(
    @Param('olympiadId', ParseIntPipe) olympiadId: number,
    @Param('problemId',  ParseIntPipe) problemId:  number,
    @Request() req: any,
    @Body() dto: SubmitSolutionDto,
  ) {
    return this.svc.submitSolution(olympiadId, problemId, req.user.userId, dto);
  }

  // ── Admin / Mentor ─────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  create(@Body() dto: CreateOlympiadDto) { return this.svc.create(dto); }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateOlympiadDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }

  @Post(':id/problems')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  addProblem(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProblemDto) {
    return this.svc.addProblem(id, dto);
  }

  @Put(':id/problems/:pid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  updateProblem(
    @Param('id',  ParseIntPipe) id:  number,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() dto: Partial<CreateProblemDto>,
  ) {
    return this.svc.updateProblem(id, pid, dto);
  }

  @Delete(':id/problems/:pid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  removeProblem(
    @Param('id',  ParseIntPipe) id:  number,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.svc.removeProblem(id, pid);
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  allSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.svc.getAllSubmissions(id);
  }

  @Put('submissions/:id/grade')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES)
  grade(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: SubmissionStatus; score: number },
  ) {
    return this.svc.gradeSubmission(id, body.status, body.score);
  }
}
