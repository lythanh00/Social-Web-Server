import { MessagesService } from './messages.service';
import { SendMessageDto } from './dtos/send-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(req: any, sendMessageDto: SendMessageDto): Promise<import("./dtos/send-message-response.dto").SendMessageResponseDto>;
    sendImageMessage(file: Express.Multer.File, req: any, sendMessageDto: SendMessageDto): Promise<import("./dtos/send-message-response.dto").SendMessageResponseDto>;
    getMessagesByChat(req: any, chatId: number, cursor: number): Promise<import("./dtos/send-message-response.dto").SendMessageResponseDto[]>;
    markMessageAsRead(req: any, chatId: number): Promise<boolean>;
    countUnreadChats(req: any): Promise<{
        unreadChatsCount: number;
        listUnreadChats: number[];
    }>;
}
