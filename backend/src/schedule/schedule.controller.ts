// src/schedule/schedule.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';
import { ScheduleSearchDto } from '../common/dto/pagination.dto';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Query() searchDto: ScheduleSearchDto) {
    return this.scheduleService.findAll(searchDto);
  }

  @Get('user')
  getUserSchedule(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end   = endDate   ? new Date(endDate)   : undefined;
    return this.scheduleService.getUserSchedule(req.user.userId, start, end);
  }

  @Get('course-group/:groupId')
  findByCourseGroup(@Param('groupId') groupId: string) {
    return this.scheduleService.findByCourseGroup(+groupId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.scheduleService.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  create(@Body() createScheduleItemDto: CreateScheduleItemDto) {
    return this.scheduleService.create(createScheduleItemDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateScheduleItemDto: UpdateScheduleItemDto) {
    return this.scheduleService.update(+id, updateScheduleItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
