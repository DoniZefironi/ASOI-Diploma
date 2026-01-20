// src/course-groups/course-groups.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { CourseGroupsService } from './course-groups.service';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('course-groups')
export class CourseGroupsController {
  constructor(private readonly courseGroupsService: CourseGroupsService) {}

  @Get()
  findAll() {
    return this.courseGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseGroupsService.findOne(+id);
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  getGroupStudents(@Param('id') id: string) {
    return this.courseGroupsService.getGroupStudents(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  create(@Body() createCourseGroupDto: CreateCourseGroupDto) {
    return this.courseGroupsService.create(createCourseGroupDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
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
  register(@Body() registerDto: RegisterToCourseDto, @Request() req) {
    return this.courseGroupsService.registerToCourse(registerDto, req.user.userId);
  }

  @Get('user/registrations')
  @UseGuards(JwtAuthGuard)
  getUserRegistrations(@Request() req) {
    return this.courseGroupsService.getUserRegistrations(req.user.userId);
  }

  @Get('registrations/all') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  getAllRegistrations() {
    return this.courseGroupsService.getAllRegistrations();
  }

  @Patch('registrations/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  approveRegistration(@Param('id') id: string, @Request() req) {
    return this.courseGroupsService.approveRegistration(+id, req.user.userId);
  }

  @Patch('registrations/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR)
  rejectRegistration(@Param('id') id: string) {
    return this.courseGroupsService.rejectRegistration(+id);
  }
}