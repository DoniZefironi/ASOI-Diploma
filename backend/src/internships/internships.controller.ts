import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InternshipsService } from './internships.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('internships')
export class InternshipsController {
  constructor(private readonly internshipsService: InternshipsService) {}

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
}
