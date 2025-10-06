import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { CourseGroupsService } from './course-groups.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';

@Controller('course-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseGroupsController {
  constructor(private courseGroupsService: CourseGroupsService) {}

  @Get()
  async findAll(
    @Query('courseId') courseId?: string,
    @Query('year') year?: string,
    @Query('active') active?: string,
  ) {
    if (courseId) {
      return this.courseGroupsService.findByCourse(+courseId);
    }
    if (year) {
      return this.courseGroupsService.findByYear(+year);
    }
    if (active === 'true') {
      return this.courseGroupsService.getActiveGroups();
    }
    return this.courseGroupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseGroupsService.findOne(+id);
  }

  @Get(':id/statistics')
  @Roles('admin', 'mentor')
  async getStatistics(@Param('id') id: string) {
    return this.courseGroupsService.getGroupStatistics(+id);
  }

  @Get(':id/registrations')
  @Roles('admin', 'mentor')
  async getRegistrations(@Param('id') id: string) {
    return this.courseGroupsService.getGroupRegistrations(+id);
  }

  @Get('user/:userId/registrations')
  async getUserRegistrations(@Param('userId') userId: string) {
    return this.courseGroupsService.getUserRegistrations(+userId);
  }

  @Post()
  @Roles('admin', 'mentor')
  async create(@Body() createCourseGroupDto: CreateCourseGroupDto) {
    return this.courseGroupsService.create(createCourseGroupDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterToCourseDto) {
    return this.courseGroupsService.registerStudent(registerDto);
  }

  @Put(':id')
  @Roles('admin', 'mentor')
  async update(
    @Param('id') id: string,
    @Body() updateCourseGroupDto: UpdateCourseGroupDto,
  ) {
    return this.courseGroupsService.update(+id, updateCourseGroupDto);
  }

  @Put('registrations/:registrationId/approve')
  @Roles('admin', 'mentor')
  async approveRegistration(@Param('registrationId') registrationId: string) {
    return this.courseGroupsService.approveRegistration(+registrationId);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.courseGroupsService.remove(+id);
  }
}