import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFriend } from 'database/user-friend.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserFriendsService {
  constructor(
    @InjectRepository(UserFriend)
    private userFriendRepository: Repository<UserFriend>,
  ) {}

  async createUserFriend(user: User, friend: User): Promise<UserFriend> {
    const userFriend = this.userFriendRepository.create({ user, friend });
    return this.userFriendRepository.save(userFriend);
  }
}
