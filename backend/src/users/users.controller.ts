// src/users/users.controller.ts
import { Controller, Get, Param, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum, isMentorRole } from './entities/user-role.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoleEnum.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('mentors')
  async findMentorsByCourseType(@Request() req, @Query('courseType') courseType?: string) {
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.includes(UserRoleEnum.ADMIN);
    
    // Если админ - возвращаем всех менторов
    if (isAdmin) {
      return this.usersService.findMentorsByCourseType(courseType);
    }
    
    // Если ментор - возвращаем только менторов его направления
    const mentorRole = userRoles.find(isMentorRole);
    if (mentorRole) {
      const mentorCourseType = mentorRole.split('_')[1];
      return this.usersService.findMentorsByCourseType(mentorCourseType);
    }
    
    return [];
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get(':id')
  @Roles(UserRoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id/roles')
  @Roles(UserRoleEnum.ADMIN)
  updateRoles(@Param('id') id: string, @Body('roles') roles: UserRoleEnum[]) {
    return this.usersService.updateUserRoles(+id, roles);
  }
}
