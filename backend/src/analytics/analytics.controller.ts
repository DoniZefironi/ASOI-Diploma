import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @UseGuards(JwtAuthGuard)
  async track(@Body() body: { path: string }, @Request() req: any) {
    const user = req.user;
    const displayName = user
      ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
      : undefined;
    await this.analyticsService.track(body.path, user?.userId, displayName);
    return { ok: true };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getStats() {
    return this.analyticsService.getStats();
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  getAllForExport() {
    return this.analyticsService.getAllForExport();
  }
}
