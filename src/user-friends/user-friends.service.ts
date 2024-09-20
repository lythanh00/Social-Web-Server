import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFriend } from 'database/user-friend.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';
import { FriendOfListFriendsResponseDto } from './dtos/friend-of-list-friends-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class UserFriendsService {
  constructor(
    @InjectRepository(UserFriend)
    private userFriendRepository: Repository<UserFriend>,
    private profilesService: ProfilesService,
    private usersService: UsersService,
  ) {}

  async createUserFriend(user: User, friend: User): Promise<UserFriend> {
    const userFriend = this.userFriendRepository.create({ user, friend });
    return this.userFriendRepository.save(userFriend);
  }

  async getUserFriend(userId: number, friendId: number): Promise<UserFriend> {
    const userFriend = await this.userFriendRepository.findOne({
      where: { user: { id: userId }, friend: { id: friendId } },
      relations: ['user', 'friend'],
    });
    return userFriend;
  }

  async isFriend(userId: number, friendId: number): Promise<boolean> {
    const userFriend = await this.userFriendRepository.findOne({
      where: [
        { user: { id: userId }, friend: { id: friendId } },
        { user: { id: friendId }, friend: { id: userId } },
      ],
    });

    if (userFriend) {
      return true;
    } else {
      return false;
    }
  }

  async getListFriends(
    userId: number,
  ): Promise<FriendOfListFriendsResponseDto[]> {
    const userFriends = await this.userFriendRepository.find({
      where: [{ user: { id: userId } }],
      relations: ['friend', 'friend.profile', 'friend.profile.avatar'],
    });

    return userFriends.map((userFriend) => ({
      id: userFriend.id,
      friend: {
        id: userFriend.friend.id,
        profile: userFriend.friend.profile,
      },
    }));
  }

  async removeFriend(userId: number, friendId: number) {
    const userFriend = await this.getUserFriend(userId, friendId);
    await this.userFriendRepository.softDelete(userFriend.id); // Soft delete với TypeORM
    return true;
  }
}
