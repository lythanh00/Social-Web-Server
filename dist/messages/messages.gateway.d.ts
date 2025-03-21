import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { ChatsService } from 'chats/chats.service';
export declare class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private chatsService;
    server: Server;
    private logger;
    private clientUserMap;
    constructor(messagesService: MessagesService, chatsService: ChatsService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleWatchingMessage(client: Socket, userId: number): void;
    handleJoinGroup(client: Socket, chatId: string): void;
    handleSendChat(client: Socket, payload: {
        senderId: number;
        chatId: number;
        receiverId: number;
        text: string;
    }): Promise<void>;
    handleMarkAsRead(client: Socket, payload: {
        ownerId: number;
        chatId: number;
    }): Promise<void>;
    leaveChat(client: Socket, chatId: number): void;
}
