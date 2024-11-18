import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'database/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { CreateChatResponseDto } from './dtos/create-chat-response.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async getChatByChatId(id: number): Promise<Chat> {
    return this.chatRepository.findOneBy({ id });
  }

  async createChat(
    participant1Id: number,
    participant2Id: number,
  ): Promise<CreateChatResponseDto> {
    const participant1 = await this.usersService.getUserById(participant1Id);
    const participant2 = await this.usersService.getUserById(participant2Id);

    // Kiểm tra nếu đã tồn tại đoạn chat giữa participant1 và participant2
    const existingChat = await this.chatRepository.findOne({
      where: [
        {
          participant1: { id: participant1Id },
          participant2: { id: participant2Id },
        }, // Trường hợp participant1 là người thứ nhất và participant2 là người thứ hai
        {
          participant1: { id: participant2Id },
          participant2: { id: participant1Id },
        },
      ],
      relations: ['participant1', 'participant2'],
    });

    if (!existingChat) {
      const chat = this.chatRepository.create({
        participant1,
        participant2,
      });
      await this.chatRepository.save(chat);
      return {
        id: chat.id,
        participant1Id: chat.participant1.id,
        participant2Id: chat.participant2.id,
      };
    }

    return {
      id: existingChat.id,
      participant1Id: existingChat.participant1.id,
      participant2Id: existingChat.participant2.id,
    };
  }

  // lay danh sach doan chat theo user id
  async getListChatsByUser(ownerId: number) {
    {
      const listChats = await this.chatRepository.find({
        where: { participant1: { id: ownerId } },
        relations: [
          'participant1',
          'participant2',
          'participant2.profile.avatar',
        ],
        order: {
          updatedAt: 'DESC', // Sắp xếp theo thời gian từ gần đến xa
        },
      });
      if (!listChats) {
        throw new NotFoundException('List chats not found...');
      }

      return listChats.map((chat) => ({
        id: chat.id,
        participant1Id: chat.participant1.id,
        participant2: {
          id: chat.participant2.id,
          firstName: chat.participant2.profile.firstName,
          lastName: chat.participant2.profile.lastName,
          avatar: chat.participant2.profile.avatar.url,
        },
      }));
    }
  }
}
