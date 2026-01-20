// src/professional-orientation/professional-orientation.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProfessionalOrientationService } from './professional-orientation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProfessionalOrientationDto } from './dto/create-professional-orientation.dto';
import { RolesGuard } from '../auth/guards/roles.guard'; 
import { Roles } from '../auth/decorators/roles.decorator'; 
import { UserRoleEnum } from '../users/entities/user-role.entity'; 

@Controller('professional-orientation')
export class ProfessionalOrientationController {
  constructor(private readonly professionalOrientationService: ProfessionalOrientationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserResult(@Request() req) {
    return this.professionalOrientationService.findByUserId(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  submitTestResult(@Body() dto: CreateProfessionalOrientationDto, @Request() req) {
    return this.professionalOrientationService.updateOrCreate(req.user.userId, dto);
  }

    @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN) 
  getStats() {
    return this.professionalOrientationService.getStats();
  }
}