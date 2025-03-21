import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getListNotificationsByOwner(req: any): Promise<{
        id: number;
        type: "message" | "comment" | "like" | "friend_request";
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
    markNotificationAsRead(req: any, notificationId: number): Promise<boolean>;
    countUnreadNotifications(req: any): Promise<number>;
}
