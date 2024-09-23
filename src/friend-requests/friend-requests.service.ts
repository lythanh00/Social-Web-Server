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
import { FriendRequestResponseDto } from './dtos/friend-request-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
import { UserFriendsService } from 'user-friends/user-friends.service';
import { RespondToFriendRequestResponseDto } from './dtos/respond-to-friend-request-response.dto';

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
    private userFriendsService: UserFriendsService,
  ) {}

  async createFriendRequest(
    sender: User,
    receiver: User,
  ): Promise<FriendRequest> {
    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
    });
    return this.friendRequestRepository.save(friendRequest);
  }

  async findFriendRequestById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }

  // send friend request
  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequestResponseDto> {
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send friend request to yourself.');
    }

    const sender = await this.usersService.getUserById(senderId);
    const receiver = await this.usersService.getUserById(receiverId);

    if (!sender || !receiver) {
      throw new NotFoundException('User not found.');
    }

    const existingRequest = await this.userFriendsService.isFriend(
      senderId,
      receiverId,
    );

    if (existingRequest) {
      throw new BadRequestException('Friend already exists in list friends.');
    }

    const existingFriend = await this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
          status: 'pending',
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
          status: 'pending',
        },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists.');
    }

    const friendRequest = await this.createFriendRequest(sender, receiver);

    const senderProfile =
      await this.profilesService.getProfileByUserId(senderId);
    const receiverProfile =
      await this.profilesService.getProfileByUserId(receiverId);

    return {
      id: friendRequest.id,
      senderId: sender.id,
      receiverId: receiver.id,
      status: 'pending',
      createdAt: friendRequest.createdAt,
      updatedAt: friendRequest.updatedAt,
    };
  }

  // respond to friend request
  async respondToFriendRequest(
    requestId: number,
    accept: boolean,
  ): Promise<RespondToFriendRequestResponseDto> {
    const friendRequest = await this.findFriendRequestById(requestId);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found.');
    }

    if (accept) {
      friendRequest.status = 'accepted';
      await this.friendRequestRepository.save(friendRequest);

      const userFriend = await this.userFriendsService.createUserFriend(
        friendRequest.sender,
        friendRequest.receiver,
      );
      console.log(userFriend);
    } else {
      friendRequest.status = 'rejected';
      await this.friendRequestRepository.save(friendRequest);
    }

    return {
      status: friendRequest.status,
    };
  }

  async isPendingFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<boolean> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { createdAt: 'DESC' }, // lấy friend request mới nhất
    });

    if (friendRequest && friendRequest.status === 'pending') {
      return true;
    } else {
      return false;
    }
  }

  async removeFriendRequest(senderId: number, receiverId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { createdAt: 'DESC' }, // lấy friend request mới nhất
    });
    if (friendRequest && friendRequest.status === 'pending') {
      await this.friendRequestRepository.softDelete(friendRequest.id); // Soft delete với TypeORM
      return true;
    } else {
      return false;
    }
  }
}
