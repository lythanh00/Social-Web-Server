import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SendMessageDto } from './dtos/send-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'database/message.entity';
import { LessThan, Repository } from 'typeorm';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { SendMessageResponseDto } from './dtos/send-message-response.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { AssetsService } from 'assets/assets.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private chatsService: ChatsService,
    private usersService: UsersService,
    private cloudinary: CloudinaryService,
    private assetsService: AssetsService,
  ) {}
  async sendMessage(
    senderId: number,
    sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponseDto> {
    const { chatId, receiverId, text } = sendMessageDto;

    const chat = await this.chatsService.getChatByChatId(chatId);
    const sender = await this.usersService.getUserById(senderId);
    const receiver = await this.usersService.getUserById(receiverId);

    const message = this.messageRepository.create({
      chat,
      sender,
      receiver,
      text,
    });

    await this.messageRepository.save(message);

    return {
      id: message.id,
      text: message.text,
      image: null,
      senderId: senderId,
      receiverId: receiverId,
      chatId: message.chat.id,
      createdAt: message.createdAt,
      isRead: message.isRead,
    };
  }

  async sendImageMessage(
    senderId: number,
    file: Express.Multer.File,
    sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponseDto> {
    const { chatId, receiverId } = sendMessageDto;

    const chat = await this.chatsService.getChatByChatId(chatId);
    const sender = await this.usersService.getUserById(senderId);
    const receiver = await this.usersService.getUserById(receiverId);

    const upload = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });

    const image = await this.assetsService.createAsset(upload.url);

    if (!image) {
      throw new UnauthorizedException('image not sent');
    }

    const message = this.messageRepository.create({
      chat,
      sender,
      receiver,
      image,
    });

    await this.messageRepository.save(message);

    return {
      id: message.id,
      text: null,
      image: message.image.url,
      senderId: senderId,
      receiverId: receiverId,
      chatId: message.chat.id,
      createdAt: message.createdAt,
      isRead: message.isRead,
    };
  }

  async getMessagesByChat(
    chatId: number,
    cursor?: number,
  ): Promise<SendMessageResponseDto[]> {
    const limit: number = 20;

    const listMessages = await this.messageRepository.find({
      where: cursor
        ? { chat: { id: chatId }, id: LessThan(cursor) } // Điều kiện lấy các id nhỏ hơn cursor
        : { chat: { id: chatId } },
      relations: ['image', 'sender', 'receiver'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return listMessages.reverse().map((message) => ({
      id: message.id,
      text: message.text,
      image: message.image ? message.image?.url : null,
      senderId: message.sender.id,
      receiverId: message.receiver.id,
      chatId: chatId,
      createdAt: message.createdAt,
      isRead: message.isRead,
    }));
  }

  async markAsRead(ownerId: number, chatId: number) {
    const listMessages = await this.messageRepository.find({
      where: {
        chat: { id: chatId },
        receiver: { id: ownerId },
        isRead: false,
      },
      order: { createdAt: 'ASC' },
    });

    if (listMessages.length) {
      listMessages.forEach((message) => {
        Object.assign(message, { isRead: true });
      });

      await this.messageRepository.save(listMessages);
      return true;
    }
    return false;
  }

  async countUnreadChats(ownerId: number) {
    // Truy vấn để lấy danh sách chat mà user có tin nhắn chưa đọc
    const unreadChats = await this.messageRepository.find({
      where: {
        receiver: { id: ownerId },
        isRead: false,
      },
      relations: ['chat'],
    });

    const uniqueArr = [...new Set(unreadChats.map((item) => item.chat.id))];
    return {
      unreadChatsCount: uniqueArr.length,
      listUnreadChats: uniqueArr,
    };
  }
}
