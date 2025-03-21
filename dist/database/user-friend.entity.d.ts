import { User } from 'database/user.entity';
export declare class UserFriend {
    id: number;
    user: User;
    friend: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
