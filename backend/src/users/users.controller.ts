// src/users/users.controller.ts
import { Controller, Get, Param, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from './entities/user-role.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoleEnum.ADMIN)
  findAll() {
    return this.usersService.findAll();
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