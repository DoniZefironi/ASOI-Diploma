import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ElectivesService } from './electives.service';
import { CreateElectiveDto } from './dto/create-elective.dto';
import { CreateAssignmentDto } from '../assignments/dto/create-assignment.dto';
import { CreateScheduleItemDto } from '../schedule/dto/create-schedule-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

const MENTOR_ROLES = [UserRoleEnum.MENTOR_ENGLISH, UserRoleEnum.MENTOR_ELECTRONICS, UserRoleEnum.MENTOR_COMPUTER_SCIENCE, UserRoleEnum.MENTOR_IOT];

@Controller('electives')
@UseGuards(JwtAuthGuard)
export class ElectivesController {
  constructor(private readonly service: ElectivesService) {}

  @Get()
  getAvailable(@Request() req) {
    return this.service.getAvailableForUser(req.user.userId);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  adminGetAll() {
    return this.service.adminGetAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.getById(id, req.user.userId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  create(@Body() dto: CreateElectiveDto) {
    return this.service.adminCreate(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateElectiveDto>) {
    return this.service.adminUpdate(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.adminDelete(id);
  }

  @Post(':id/enroll')
  enroll(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.enroll(id, req.user.userId);
  }

  @Delete(':id/enroll')
  unenroll(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.unenroll(id, req.user.userId);
  }

  @Get(':id/participants')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  participants(@Param('id', ParseIntPipe) id: number) {
    return this.service.adminGetParticipants(id);
  }

  // --- Assignments ---

  @Get(':id/assignments')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  getAssignments(@Param('id', ParseIntPipe) id: number) {
    return this.service.getElectiveAssignments(id);
  }

  @Post(':id/assignments')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  createAssignment(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAssignmentDto) {
    return this.service.createElectiveAssignment(id, dto);
  }

  @Delete(':id/assignments/:assignmentId')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  deleteAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    return this.service.deleteElectiveAssignment(id, assignmentId);
  }

  // --- Schedule ---

  @Get(':id/schedule')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  getSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.service.getElectiveSchedule(id);
  }

  @Post(':id/schedule')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  createScheduleItem(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateScheduleItemDto) {
    return this.service.createElectiveScheduleItem(id, dto);
  }

  @Delete(':id/schedule/:itemId')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, ...MENTOR_ROLES)
  deleteScheduleItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.deleteElectiveScheduleItem(id, itemId);
  }
}
