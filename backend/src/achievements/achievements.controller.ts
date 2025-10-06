// src/achievements/achievements.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  findAllAchievements() {
    return this.achievementsService.findAllAchievements();
  }

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: string) {
    return this.achievementsService.getLeaderboard(limit ? +limit : 10);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.userId);
  }

  @Get(':id')
  findAchievementById(@Param('id') id: string) {
    return this.achievementsService.findAchievementById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  createAchievement(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.createAchievement(createAchievementDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  updateAchievement(@Param('id') id: string, @Body() updateAchievementDto: UpdateAchievementDto) {
    return this.achievementsService.updateAchievement(+id, updateAchievementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  removeAchievement(@Param('id') id: string) {
    return this.achievementsService.removeAchievement(+id);
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  checkAndGrantAchievements(@Request() req) {
    return this.achievementsService.checkAndGrantAchievements(req.user.userId);
  }

  @Post('grant/:achievementId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  grantAchievementToUser(
    @Param('achievementId') achievementId: string,
    @Body('userId') userId: number,
  ) {
    return this.achievementsService.grantAchievement(userId, +achievementId);
  }
}