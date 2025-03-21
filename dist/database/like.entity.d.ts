import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';
import { Notification } from './notification.entity';
export declare class Like {
    id: number;
    post: Post;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    notification: Notification;
}
