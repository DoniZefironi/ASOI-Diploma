// src/assignments/peer-review-session.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PeerReviewSessionService } from './peer-review-session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';

@Controller('peer-review-sessions')
@UseGuards(JwtAuthGuard)
export class PeerReviewSessionController {
  constructor(private readonly sessionService: PeerReviewSessionService) {}

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get('assignment/:assignmentId')
  findByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.sessionService.findByAssignmentId(+assignmentId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sessionService.findById(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  createSession(@Body() dto: any, @Request() req) {
    return this.sessionService.createSession({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Post(':id/assign')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  assignPeerReviews(@Param('id') id: string) {
    return this.sessionService.assignPeerReviews(+id);
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.getSessionStats(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  updateSession(@Param('id') id: string, @Body() dto: any) {
    return this.sessionService.updateSession(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  deleteSession(@Param('id') id: string) {
    return this.sessionService.deleteSession(+id);
  }
}
