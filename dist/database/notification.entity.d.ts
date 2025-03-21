import { User } from 'database/user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { FriendRequest } from './friend-request.entity';
export declare class Notification {
    id: number;
    sender: User;
    receiver: User;
    type: 'friend_request' | 'comment' | 'like' | 'message';
    like: Like;
    comment: Comment;
    friendRequest: FriendRequest;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
