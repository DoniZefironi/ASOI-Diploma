// src/course-groups/course-groups.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { CourseGroupsService } from './course-groups.service';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES, STUDENT_ROLES, ALL_ROLES } from '../common/helpers/role.helper';
import { GroupSearchDto } from '../common/dto/pagination.dto';

@Controller('course-groups')
export class CourseGroupsController {
  constructor(private readonly courseGroupsService: CourseGroupsService) {}

  @Get()
  @Roles(...ALL_ROLES)
  findAll(@Query() searchDto: GroupSearchDto) {
    return this.courseGroupsService.findAll(searchDto);
  }

  @Get('course/:courseId')
  @Roles(...ALL_ROLES)
  getGroupsByCourse(@Param('courseId') courseId: string) {
    return this.courseGroupsService.findByCourseId(+courseId);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  findOne(@Param('id') id: string) {
    return this.courseGroupsService.findOne(+id);
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getGroupStudents(@Param('id') id: string) {
    return this.courseGroupsService.getGroupStudents(+id);
  }

  @Get(':id/students/rating')
  @UseGuards(JwtAuthGuard)
  @Roles(...STUDENT_ROLES, ...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getGroupStudentsRating(@Param('id') id: string) {
    return this.courseGroupsService.getGroupStudentsWithRating(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  create(@Body() createCourseGroupDto: CreateCourseGroupDto, @Request() req) {
    // Менторы могут создавать группы только для своих курсов
    return this.courseGroupsService.create(createCourseGroupDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateCourseGroupDto: UpdateCourseGroupDto) {
    return this.courseGroupsService.update(+id, updateCourseGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.courseGroupsService.remove(+id);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @Roles(...STUDENT_ROLES, ...MENTOR_ROLES, UserRoleEnum.ADMIN)
  register(@Body() registerDto: RegisterToCourseDto, @Request() req) {
    return this.courseGroupsService.registerToCourse(registerDto, req.user.userId);
  }

  @Get('user/registrations')
  @UseGuards(JwtAuthGuard)
  @Roles(...STUDENT_ROLES, ...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getUserRegistrations(@Request() req) {
    return this.courseGroupsService.getUserRegistrations(req.user.userId);
  }

  @Get('registrations/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getAllRegistrations() {
    return this.courseGroupsService.getAllRegistrations();
  }

  @Patch('registrations/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  approveRegistration(@Param('id') id: string, @Request() req) {
    return this.courseGroupsService.approveRegistration(+id, req.user.userId);
  }

  @Patch('registrations/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  rejectRegistration(@Param('id') id: string) {
    return this.courseGroupsService.rejectRegistration(+id);
  }

  @Post('sync-student-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async syncStudentRoles() {
    return this.courseGroupsService.syncStudentRoles();
  }
}
