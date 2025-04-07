import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    senderId: number,
    receiverId: number,
    type: 'friend_request' | 'comment' | 'like' | 'message',
    likeId: number,
    commentId: number,
    friendRequestId: number,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      type,
      like: { id: likeId },
      comment: { id: commentId },
      friendRequest: { id: friendRequestId },
    });
    await this.notificationRepository.save(notification);

    // // Gửi thông báo qua WebSocket nếu người dùng online
    // this.notificationGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  // lay danh sach thong bao theo user id
  async getListNotificationsByUser(ownerId) {
    {
      const limit: number = 30;
      const listNotifications = await this.notificationRepository.find({
        where: { receiver: { id: ownerId } },
        relations: [
          'sender',
          'sender.profile',
          'sender.profile.avatar',
          'like',
          'like.post',
          'comment',
          'comment.post',
          'friendRequest',
        ],
        order: {
          createdAt: 'DESC', // Sắp xếp theo thời gian từ gần đến xa
        },
        take: limit,
      });
      if (!listNotifications) {
        throw new NotFoundException('List notifications not found...');
      }

      return listNotifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        likedPostId: notification.like?.post.id,
        commentedPostId: notification.comment?.post.id,
        friendRequestId: notification.friendRequest?.id,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        sender: {
          firstName: notification.sender.profile.firstName,
          lastName: notification.sender.profile.lastName,
          avatar: notification.sender.profile.avatar.url,
        },
      }));
    }
  }

  async markNotificationAsRead(ownerId: number, notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
      receiver: { id: ownerId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await Object.assign(notification, { isRead: true });
    await this.notificationRepository.save(notification);
  }

  async countUnreadNotifications(ownerId: number) {
    const limit: number = 30;
    const notifications = await this.notificationRepository.find({
      where: {
        receiver: { id: ownerId },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    // Đếm số tin nhắn chưa đọc trong danh sách đã lấy
    const unreadNotificationsCount = notifications.filter(
      (notification) => !notification.isRead,
    ).length;

    return unreadNotificationsCount;
  }
}
