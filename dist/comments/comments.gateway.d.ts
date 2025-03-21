import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
export declare class CommentsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly commentsService;
    server: Server;
    private logger;
    constructor(commentsService: CommentsService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinGroup(client: Socket, postId: string): void;
    handleSendComment(client: Socket, payload: {
        userId: number;
        postId: number;
        content: string;
    }): Promise<void>;
}
