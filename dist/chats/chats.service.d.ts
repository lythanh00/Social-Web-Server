import { Chat } from 'database/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { CreateChatResponseDto } from './dtos/create-chat-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
export declare class ChatsService {
    private chatRepository;
    private usersService;
    private profilesService;
    constructor(chatRepository: Repository<Chat>, usersService: UsersService, profilesService: ProfilesService);
    getChatByChatId(id: number): Promise<Chat>;
    createChat(participant1Id: number, participant2Id: number): Promise<CreateChatResponseDto>;
    getListChatsByUser(ownerId: number): Promise<{
        id: number;
        lastMessage: string;
        participant1: {
            id: number;
            profile: {
                firstName: string;
                lastName: string;
                avatar: {
                    url: string;
                };
            };
        };
        participant2: {
            id: number;
            profile: {
                firstName: string;
                lastName: string;
                avatar: {
                    url: string;
                };
            };
        };
    }[]>;
    getChatWithSocket(chatId: number): Promise<{
        id: number;
        lastMessage: string;
        participant1: {
            id: number;
            profile: {
                firstName: string;
                lastName: string;
                avatar: {
                    url: string;
                };
            };
        };
        participant2: {
            id: number;
            profile: {
                firstName: string;
                lastName: string;
                avatar: {
                    url: string;
                };
            };
        };
    }>;
}
