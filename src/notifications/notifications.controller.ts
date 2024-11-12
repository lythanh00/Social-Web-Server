import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Get('list-notifications-by-owner')
  async getListNotificationsByOwner(@Request() req) {
    return this.notificationsService.getListNotificationsByUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('mark-notification-as-read')
  async markNotificationAsRead(
    @Request() req,
    @Body('notificationId') notificationId: number,
  ) {
    await this.notificationsService.markNotificationAsRead(
      req.user.id,
      notificationId,
    );
    return true;
  }
}
