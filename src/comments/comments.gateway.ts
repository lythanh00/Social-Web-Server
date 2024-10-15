import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('CommentsGateway');

  constructor(private readonly commentsService: CommentsService) {}

  afterInit(server: Server) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket) {
    client.connected;
    console.log(`Client connected comment: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected comment: ${client.id}`);
  }

  @SubscribeMessage('join_comment')
  handleJoinGroup(client: Socket, postId: string): void {
    client.join(postId.toString());
    console.log(`Client ${client.id} joined comment post: ${postId}`);
  }

  @SubscribeMessage('sendComment')
  async handleSendComment(
    client: Socket,
    payload: { userId: number; postId: number; content: string },
  ) {
    const { userId, postId, content } = payload;
    const comment = await this.commentsService.createCommentPost(
      userId,
      postId,
      content,
    );

    // Phát sự kiện `newComment` đến tất cả các client trong room của postId
    this.server.to(postId.toString()).emit('newComment', comment);
  }

  // @SubscribeMessage('sendComment')
  // handleSendComment(client: Socket, payload: any): void {
  //   // Broadcast the comment to all connected clients
  //   this.server.emit('newComment', payload);
  // }
}
