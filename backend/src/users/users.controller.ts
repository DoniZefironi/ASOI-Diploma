import { Controller, Get, Param, Put, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin', 'mentor')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':id/roles')
  async getUserRoles(@Param('id') id: string) {
    return this.usersService.getUserRoles(+id);
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.usersService.updateProfile(+id, updateData);
  }

  @Put(':id/roles')
  @Roles('admin')
  async assignRole(
    @Param('id') id: string,
    @Body() roleData: { role: string },
  ) {
    return this.usersService.assignRole(+id, roleData.role);
  }

  @Put(':id/roles/remove')
  @Roles('admin')
  async removeRole(
    @Param('id') id: string,
    @Body() roleData: { role: string },
  ) {
    return this.usersService.removeRole(+id, roleData.role);
  }
}