import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriend } from '../database/user-friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFriend])],
  providers: [],
  controllers: [],
})
export class UserFriendsModule {}
