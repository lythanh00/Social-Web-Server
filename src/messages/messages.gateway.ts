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
  private clientUserMap: Map<string, number> = new Map();

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
    this.clientUserMap.delete(client.id);
  }

  @SubscribeMessage('watching_message')
  handleWatchingMessage(client: Socket, userId: number): void {
    this.clientUserMap.set(client.id, userId); // Lưu clientId và userId
    console.log(`Client ${client.id} map userId: ${userId}`);
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

    // Tìm clientId của người nhận (receiverId)
    const receiverClientId = Array.from(this.clientUserMap.entries()).find(
      ([, userId]) => userId === receiverId,
    )?.[0];
    console.log(`receiverClientId ${receiverClientId}`);

    // Lấy danh sách các client trong phòng
    const room = await this.server.in(chatId.toString()).fetchSockets();
    console.log(`room ${chatId}`);

    // Nếu phòng tồn tại và người nhận đang onl và người nhận đang không tham gia phòng chat thì gửi thông báo
    if (
      room &&
      receiverClientId &&
      !room.map((item) => item.id).includes(receiverClientId)
    ) {
      console.log(`Room ${chatId} has not: ${receiverClientId}`);
      const messageNotification = { chatId, receiverId };

      this.server
        .to(receiverClientId)
        .emit('message_notification', messageNotification);
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    client: Socket,
    payload: {
      ownerId: number;
      chatId: number;
    },
  ) {
    const { ownerId, chatId } = payload;
    const markAsRead = await this.messagesService.markAsRead(ownerId, chatId);

    // Phát sự kiện `newComment` đến tất cả các client trong room của postId
    this.server.to(chatId.toString()).emit('markAsRead', markAsRead);
  }

  @SubscribeMessage('leave_chat')
  leaveChat(client: Socket, chatId: string): void {
    client.leave(chatId);
    console.log(`Client ${client.id} left chat: ${chatId}`);
  }
}
