import { ChatsService } from './chats.service';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    createChat(req: any, participant2Id: number): Promise<import("./dtos/create-chat-response.dto").CreateChatResponseDto>;
    getListChatsByOwner(req: any): Promise<{
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
}
