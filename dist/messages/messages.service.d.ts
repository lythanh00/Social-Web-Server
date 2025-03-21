import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from 'database/message.entity';
import { Repository } from 'typeorm';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { SendMessageResponseDto } from './dtos/send-message-response.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { AssetsService } from 'assets/assets.service';
export declare class MessagesService {
    private messageRepository;
    private chatsService;
    private usersService;
    private cloudinary;
    private assetsService;
    constructor(messageRepository: Repository<Message>, chatsService: ChatsService, usersService: UsersService, cloudinary: CloudinaryService, assetsService: AssetsService);
    sendMessage(senderId: number, sendMessageDto: SendMessageDto): Promise<SendMessageResponseDto>;
    sendImageMessage(senderId: number, file: Express.Multer.File, sendMessageDto: SendMessageDto): Promise<SendMessageResponseDto>;
    getMessagesByChat(chatId: number, cursor?: number): Promise<SendMessageResponseDto[]>;
    markAsRead(ownerId: number, chatId: number): Promise<boolean>;
    countUnreadChats(ownerId: number): Promise<{
        unreadChatsCount: number;
        listUnreadChats: number[];
    }>;
}
