// src/assignments/peer-review.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PeerReviewService } from './peer-review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { CreatePeerReviewDto, AssignPeerReviewsDto } from './dto/create-peer-review.dto';

@Controller('peer-reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PeerReviewController {
  constructor(private readonly peerReviewService: PeerReviewService) {}

  /**
   * Назначить peer review для задания
   * Доступно только менторам и админам
   */
  @Post('assign')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR_ENGLISH, UserRoleEnum.MENTOR_ELECTRONICS, UserRoleEnum.MENTOR_COMPUTER_SCIENCE, UserRoleEnum.MENTOR_IOT)
  async assignReviews(@Body() dto: AssignPeerReviewsDto) {
    return this.peerReviewService.assignPeerReviews(dto.assignmentId, dto.reviewsPerStudent);
  }

  /**
   * Получить работы которые нужно проверить (для студента)
   */
  @Get('to-review')
  async getReviewsToComplete(@Request() req) {
    return this.peerReviewService.getReviewsToComplete(req.user.userId);
  }

  /**
   * Получить рецензии на свою работу
   */
  @Get('submission/:submissionId')
  async getReviewsForSubmission(@Request() req, @Param('submissionId', ParseIntPipe) submissionId: number) {
    return this.peerReviewService.getReviewsForSubmission(req.user.userId, submissionId);
  }

  /**
   * Создать или обновить рецензию
   */
  @Post()
  async createPeerReview(@Request() req, @Body() dto: CreatePeerReviewDto) {
    return this.peerReviewService.createPeerReview(req.user.userId, dto);
  }

  /**
   * Получить статистику peer review для задания (для ментора)
   */
  @Get('stats/:assignmentId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MENTOR_ENGLISH, UserRoleEnum.MENTOR_ELECTRONICS, UserRoleEnum.MENTOR_COMPUTER_SCIENCE, UserRoleEnum.MENTOR_IOT)
  async getStats(@Param('assignmentId', ParseIntPipe) assignmentId: number) {
    return this.peerReviewService.getPeerReviewStats(assignmentId);
  }
}
