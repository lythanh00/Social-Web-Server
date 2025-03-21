import { Asset } from 'database/asset.entity';
import { Chat } from 'database/chat.entity';
import { User } from 'database/user.entity';
export declare class Message {
    id: number;
    chat: Chat;
    sender: User;
    receiver: User;
    text: string;
    image: Asset;
    isRead: boolean;
    isEdited: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
