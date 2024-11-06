import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Notification } from 'database/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // Tạo thông báo mới
  async createNotification(
    userId: number,
    type: 'friend_request' | 'comment' | 'like' | 'message',
    dataId: number,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId },
      type,
      dataId,
    });
    await this.notificationRepository.save(notification);

    // // Gửi thông báo qua WebSocket nếu người dùng online
    // this.notificationGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  // lay danh sach thong bao theo user id
  async getListNotificationsByUser(ownerId) {
    {
      const listNotifications = await this.notificationRepository.find({
        where: { user: { id: ownerId } },
        relations: [],
        order: {
          updatedAt: 'DESC', // Sắp xếp theo thời gian từ gần đến xa
        },
      });
      if (!listNotifications) {
        throw new UnauthorizedException('List notifications not found...');
      }

      return listNotifications;
    }
  }
}
