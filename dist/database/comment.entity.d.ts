import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';
import { Notification } from './notification.entity';
export declare class Comment {
    id: number;
    post: Post;
    user: User;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    notification: Notification;
}
