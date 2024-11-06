import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
