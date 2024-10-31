import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessagesGateway');

  constructor(private readonly messagesService: MessagesService) {}

  afterInit(server: Server) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket) {
    client.connected;
    console.log(`Client connected chat: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected chat: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinGroup(client: Socket, chatId: string): void {
    client.join(chatId.toString());
    console.log(`Client ${client.id} joined chat: ${chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendChat(
    client: Socket,
    payload: {
      senderId: number;
      chatId: number;
      receiverId: number;
      text: string;
    },
  ) {
    const { senderId, chatId, receiverId, text } = payload;
    const message = await this.messagesService.sendMessage(senderId, {
      chatId,
      receiverId,
      text,
    });

    // Phát sự kiện `newComment` đến tất cả các client trong room của postId
    this.server.to(chatId.toString()).emit('newMessage', message);
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    client: Socket,
    payload: {
      senderId: number;
      chatId: number;
    },
  ) {
    const { senderId, chatId } = payload;
    const markAsRead = await this.messagesService.markAsRead(senderId, chatId);

    // Phát sự kiện `newComment` đến tất cả các client trong room của postId
    this.server.to(chatId.toString()).emit('markAsRead', markAsRead);
  }

  // @SubscribeMessage('sendComment')
  // handleSendComment(client: Socket, payload: any): void {
  //   // Broadcast the comment to all connected clients
  //   this.server.emit('newComment', payload);
  // }
}
