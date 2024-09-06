import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'database/friend-request.entity';
import { UserFriend } from 'database/user-friend.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { FriendRequestResponseDto } from './dtos/friend-requests-response.dto';
import { ProfilesService } from 'profiles/profiles.service';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserFriend)
    private userFriendRepository: Repository<UserFriend>,
    private usersService: UsersService,
    private profilesService: ProfilesService,
  ) {}

  // send friend request
  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequestResponseDto> {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself.');
    }

    const sender = await this.usersService.findUserById(senderId);
    const receiver = await this.usersService.findUserById(receiverId);

    if (!sender || !receiver) {
      throw new NotFoundException('User not found.');
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists.');
    }

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
    });

    await this.friendRequestRepository.save(friendRequest);

    const senderProfile = await this.profilesService.getProfile(senderId);
    const receiverProfile = await this.profilesService.getProfile(receiverId);

    return {
      id: friendRequest.id,
      sender: {
        id: sender.id,
        email: sender.email,
        profile: senderProfile,
      },
      receiver: {
        id: receiver.id,
        email: receiver.email,
        profile: receiverProfile,
      },
      status: 'pending',
      createdAt: friendRequest.createdAt,
      updatedAt: friendRequest.updatedAt,
    };
  }
}
