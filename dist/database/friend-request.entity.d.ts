import { User } from 'database/user.entity';
import { Notification } from './notification.entity';
export declare class FriendRequest {
    id: number;
    sender: User;
    receiver: User;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    notification: Notification;
}
