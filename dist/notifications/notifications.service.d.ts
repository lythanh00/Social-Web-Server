import { Notification } from 'database/notification.entity';
import { Repository } from 'typeorm';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createNotification(senderId: number, receiverId: number, type: 'friend_request' | 'comment' | 'like' | 'message', likeId: number, commentId: number, friendRequestId: number): Promise<Notification>;
    getListNotificationsByUser(ownerId: any): Promise<{
        id: number;
        type: "friend_request" | "comment" | "like" | "message";
        likedPostId: number;
        commentedPostId: number;
        friendRequestId: number;
        isRead: boolean;
        createdAt: Date;
        sender: {
            firstName: string;
            lastName: string;
            avatar: string;
        };
    }[]>;
    markNotificationAsRead(ownerId: number, notificationId: number): Promise<void>;
    countUnreadNotifications(ownerId: number): Promise<number>;
}
