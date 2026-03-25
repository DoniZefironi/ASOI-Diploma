import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, ParseIntPipe, Request, BadRequestException } from '@nestjs/common';
import { InternshipsService } from './internships.service';
import { InternshipsHhService } from './internships-hh.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { ApplyToInternshipDto } from './dto/apply-to-internship.dto';
import { ImportFromHhDto } from './dto/import-from-hh.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('internships')
export class InternshipsController {
  constructor(
    private readonly internshipsService: InternshipsService,
    private readonly internshipsHhService: InternshipsHhService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.internshipsService.findAll();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  adminFindAll() {
    return this.internshipsService.adminFindAll();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getStats() {
    return this.internshipsService.getStats();
  }

  @Post('admin/import-hh')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async importFromHh(@Body() dto: ImportFromHhDto) {
    return this.internshipsHhService.importFromHh(
      dto.searchQuery,
      dto.limit,
    );
  }

  @Get('admin/import-hh-scheduled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async scheduledImport() {
    return this.internshipsHhService.scheduledImport();
  }

  @Get('admin/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getApplications(@Param('internshipId') internshipId?: string) {
    const id = internshipId ? parseInt(internshipId, 10) : undefined;
    if (internshipId && isNaN(id!)) {
      throw new BadRequestException('Invalid internshipId');
    }
    return this.internshipsService.getApplications(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.internshipsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  create(@Body() dto: CreateInternshipDto) {
    return this.internshipsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateInternshipDto>) {
    return this.internshipsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.internshipsService.remove(id);
  }

  // ── Отслеживание просмотров ────────────────────────────────────────────────

  @Post(':id/view')
  @UseGuards(JwtAuthGuard)
  trackView(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.internshipsService.trackView(req.user.userId, id);
  }

  // ── Подача заявки ──────────────────────────────────────────────────────────

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  applyToInternship(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApplyToInternshipDto,
  ) {
    return this.internshipsService.applyToInternship(req.user.userId, id, dto);
  }

  @Get(':id/application')
  @UseGuards(JwtAuthGuard)
  getUserApplication(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.internshipsService.getUserApplication(req.user.userId, id);
  }
}
