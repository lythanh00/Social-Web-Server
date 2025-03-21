import { Message } from 'database/message.entity';
import { User } from 'database/user.entity';
export declare class Chat {
    id: number;
    participant1: User;
    participant2: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    messages: Message[];
}
