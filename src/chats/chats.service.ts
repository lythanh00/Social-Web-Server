import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'database/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { CreateChatResponseDto } from './dtos/create-chat-response.dto';
import { ProfilesService } from 'profiles/profiles.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private usersService: UsersService,
    private profilesService: ProfilesService,
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
    const participant1Profile =
      await this.profilesService.getProfileByUserId(participant1Id);
    const participant2Profile =
      await this.profilesService.getProfileByUserId(participant2Id);

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
        participant1: {
          id: chat.participant1.id,
          profile: participant1Profile,
        },
        participant2: {
          id: chat.participant2.id,
          profile: participant2Profile,
        },
      };
    }

    return {
      id: existingChat.id,
      participant1: {
        id: existingChat.participant1.id,
        profile: participant1Profile,
      },
      participant2: {
        id: existingChat.participant2.id,
        profile: participant2Profile,
      },
    };
  }

  // lay danh sach doan chat theo user id
  async getListChatsByUser(ownerId: number) {
    {
      const listChats = await this.chatRepository.find({
        where: [
          { participant1: { id: ownerId } },
          { participant2: { id: ownerId } },
        ],
        relations: [
          'participant1.profile.avatar',
          'participant2.profile.avatar',
          'messages',
        ],
        order: {
          messages: {
            createdAt: 'DESC', // Sắp xếp theo tin nhắn mới nhất
          },
        },
      });
      if (!listChats) {
        throw new NotFoundException('List chats not found...');
      }

      return listChats.map((chat) => ({
        id: chat.id,
        lastMessage: chat.messages[0]?.text || null, // Tin nhắn cuối cùng (nếu có)
        participant1: {
          id: chat.participant1.id,
          profile: {
            firstName: chat.participant1.profile.firstName,
            lastName: chat.participant1.profile.lastName,
            avatar: {
              url: chat.participant1.profile.avatar.url,
            },
          },
        },
        participant2: {
          id: chat.participant2.id,
          profile: {
            firstName: chat.participant2.profile.firstName,
            lastName: chat.participant2.profile.lastName,
            avatar: {
              url: chat.participant2.profile.avatar.url,
            },
          },
        },
      }));
    }
  }

  // lay doan chat voi socket
  async getChatWithSocket(chatId: number) {
    {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: [
          'participant1.profile.avatar',
          'participant2.profile.avatar',
          'messages',
        ],
      });
      if (!chat) {
        throw new NotFoundException('Chat not found...');
      }

      // Tin nhắn cuối cùng (nếu có)
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].text
          : null;

      return {
        id: chat.id,
        lastMessage,
        participant1: {
          id: chat.participant1.id,
          profile: {
            firstName: chat.participant1.profile.firstName,
            lastName: chat.participant1.profile.lastName,
            avatar: {
              url: chat.participant1.profile.avatar.url,
            },
          },
        },
        participant2: {
          id: chat.participant2.id,
          profile: {
            firstName: chat.participant2.profile.firstName,
            lastName: chat.participant2.profile.lastName,
            avatar: {
              url: chat.participant2.profile.avatar.url,
            },
          },
        },
      };
    }
  }
}
