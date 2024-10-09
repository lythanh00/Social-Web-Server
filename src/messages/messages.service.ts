import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SendMessageDto } from './dtos/send-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'database/message.entity';
import { Repository } from 'typeorm';
import { ChatsService } from 'chats/chats.service';
import { UsersService } from 'users/users.service';
import { SendMessageResponseDto } from './dtos/send-message-response.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { AssetsService } from 'assets/assets.service';
import { SendImageMessageResponseDto } from './dtos/send-image-message-response.dto';

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
      createdAt: message.createdAt,
    };
  }

  async sendImageMessage(
    senderId: number,
    file: Express.Multer.File,
    sendMessageDto: SendMessageDto,
  ): Promise<SendImageMessageResponseDto> {
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
      image: message.image.url,
      createdAt: message.createdAt,
    };
  }
}
