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
    const user = await this.usersService.getUserById(userId);
    const friend = await this.usersService.getUserById(friendId);
    const userFriend = await this.userFriendRepository.findOne({
      where: { user: { id: userId }, friend: { id: friendId } },
      relations: ['user', 'friend'],
    });
    return userFriend;
  }

  async getListFriends(
    userId: number,
  ): Promise<FriendOfListFriendsResponseDto[]> {
    const friends = await this.userFriendRepository.find({
      where: [{ user: { id: userId } }],
      relations: ['friend'],
    });

    const friendsWithProfile = await Promise.all(
      friends.map(async (friend) => {
        const friendProfile = await this.profilesService.getProfile(
          friend.friend.id,
        );
        return {
          id: friend.id,
          friend: {
            id: friend.friend.id,
            profile: friendProfile,
          },
        };
      }),
    );
    return friendsWithProfile;
  }

  async removeFriend(userId: number, friendId: number) {
    const userFriend = await this.getUserFriend(userId, friendId);
    await this.userFriendRepository.softDelete(userFriend.id); // Soft delete với TypeORM
    return true;
  }
}
