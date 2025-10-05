import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles('admin')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Post(':id/roles/:role')
    @Roles('admin')
    assignRole(@Param('id') id: string, @Param('role') role: string) {
        return this.usersService.assignRole(+id, role);
    }

    @Delete('roles/:roleId')
    @Roles('admin')
    removeRole(@Param('roleId') roleId: string) {
        return this.usersService.removeRole(+roleId);
    }
}
