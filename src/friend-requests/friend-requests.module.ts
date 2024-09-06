import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from '../database/friend-request.entity';
import { User } from 'database/user.entity';
import { UserFriend } from 'database/user-friend.entity';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { UsersModule } from 'users/users.module';
import { ProfilesModule } from 'profiles/profiles.module';
import { UserFriendsModule } from 'user-friends/user-friends.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, User, UserFriend]),
    UsersModule,
    ProfilesModule,
    UserFriendsModule,
  ],
  providers: [FriendRequestsService],
  controllers: [FriendRequestsController],
})
export class FriendRequestsModule {}
