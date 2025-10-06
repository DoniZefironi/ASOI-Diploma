import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';

@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  async findAll(
    @Query('courseGroupId') courseGroupId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('upcoming') upcoming?: string,
    @Query('overdue') overdue?: string,
  ) {
    if (courseGroupId) {
      return this.scheduleService.findByCourseGroup(+courseGroupId);
    }
    if (startDate && endDate) {
      return this.scheduleService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    if (upcoming === 'true') {
      const limit = parseInt(upcoming) || 10;
      return this.scheduleService.findUpcoming(limit);
    }
    if (overdue === 'true') {
      return this.scheduleService.findOverdue();
    }
    return this.scheduleService.findAll();
  }

  @Get('user/:userId')
  async getUserSchedule(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.scheduleService.getScheduleForUser(userId, start, end);
  }

  @Get('user/:userId/upcoming-assignments')
  async getUpcomingAssignments(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: string,
  ) {
    return this.scheduleService.getUpcomingAssignments(userId, parseInt(limit) || 5);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Get(':id/statistics')
  @Roles('admin', 'mentor')
  async getStatistics(@Param('id') id: string) {
    return this.scheduleService.getScheduleStatistics(+id);
  }

  @Post()
  @Roles('admin', 'mentor')
  async create(@Body() createScheduleItemDto: CreateScheduleItemDto) {
    return this.scheduleService.create(createScheduleItemDto);
  }

  @Put(':id')
  @Roles('admin', 'mentor')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleItemDto: UpdateScheduleItemDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleItemDto);
  }

  @Delete(':id')
  @Roles('admin', 'mentor')
  async remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}