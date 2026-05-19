import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  getAll(@Request() req) {
    return this.service.findForUser(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.service.countUnread(req.user.userId).then(count => ({ count }));
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.service.markRead(+id, req.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.service.markAllRead(req.user.userId);
  }
}
