import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFriend } from 'database/user-friend.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';
import { FriendOfListFriendsResponseDto } from './dtos/friend-of-list-friends-response.dto';
import { ProfilesService } from 'profiles/profiles.service';

@Injectable()
export class UserFriendsService {
  constructor(
    @InjectRepository(UserFriend)
    private userFriendRepository: Repository<UserFriend>,
    private profilesService: ProfilesService,
  ) {}

  async createUserFriend(user: User, friend: User): Promise<UserFriend> {
    const userFriend = this.userFriendRepository.create({ user, friend });
    return this.userFriendRepository.save(userFriend);
  }

  async getListFriends(
    userId: number,
  ): Promise<FriendOfListFriendsResponseDto[]> {
    const friends = await this.userFriendRepository.find({
      where: [{ user: { id: userId } }],
      relations: ['friend'],
    });

    const friendsWithProfiles = await Promise.all(
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
    return friendsWithProfiles;
  }
}
