// src/professional-orientation/professional-orientation.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProfessionalOrientationService } from './professional-orientation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { SubmitTestDto } from './dto/submit-test.dto';
import { SubmitExpertResultDto } from './dto/submit-expert-result.dto';

@Controller('professional-orientation')
export class ProfessionalOrientationController {
  constructor(private readonly service: ProfessionalOrientationService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get('tests')
  getTests() {
    return this.service.getTests();
  }

  @Get('tests/:type/questions')
  getQuestions(@Param('type') type: string) {
    return this.service.getTestQuestions(type);
  }

  @Post('tests/submit')
  @UseGuards(JwtAuthGuard)
  submitTest(@Request() req: any, @Body() dto: SubmitTestDto) {
    return this.service.submitTest(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserResult(@Request() req: any) {
    return this.service.findByUserId(req.user.userId);
  }

  /** Совместимость со старым модальным окном */
  @Post()
  @UseGuards(JwtAuthGuard)
  legacySubmit(@Request() req: any, @Body() dto: { recommendedProfession: string; testResult?: any }) {
    return this.service.legacyUpdateOrCreate(req.user.userId, dto);
  }

  // ── Admin: статистика и управление тестами ────────────────────────────────

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getStats() {
    return this.service.getStats();
  }

  @Get('admin/tests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminGetAllTests() {
    return this.service.adminGetAllTests();
  }

  @Get('admin/tests/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminGetTest(@Param('type') type: string) {
    return this.service.adminGetTest(type);
  }

  @Post('admin/tests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminCreateTest(@Body() dto: any) {
    return this.service.adminCreateTest(dto);
  }

  @Put('admin/tests/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminUpdateTest(@Param('type') type: string, @Body() dto: any) {
    return this.service.adminUpdateTest(type, dto);
  }

  @Delete('admin/tests/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminDeleteTest(@Param('type') type: string) {
    return this.service.adminDeleteTest(type);
  }

  // ── Expert Analysis ───────────────────────────────────────────────────────

  @Get('expert-analysis')
  @UseGuards(JwtAuthGuard)
  async getExpertAnalysis(@Request() req: any) {
    return this.service.getExpertAnalysis(req.user.userId);
  }

  // ── AI Roadmap ────────────────────────────────────────────────────────────

  @Post('roadmap')
  @UseGuards(JwtAuthGuard)
  async generateRoadmap(@Body() dto: {
    careerId: string;
    careerTitle: string;
    traitScores: Record<string, number>;
    firedRuleDescriptions: string[];
    confidence: number;
  }) {
    return this.service.generateRoadmap(dto);
  }

  // ── Expert System Result ──────────────────────────────────────────────────

  @Post('expert-result')
  @UseGuards(JwtAuthGuard)
  async submitExpertResult(
    @Request() req: any,
    @Body() dto: SubmitExpertResultDto,
  ) {
    return this.service.submitExpertResult(req.user.userId, dto);
  }
}
