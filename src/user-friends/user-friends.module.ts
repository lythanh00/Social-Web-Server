import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriend } from '../database/user-friend.entity';
import { UserFriendsService } from './user-friends.service';
import { UserFriendsController } from './user-friends.controller';
import { ProfilesModule } from 'profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserFriend]), ProfilesModule],
  providers: [UserFriendsService],
  controllers: [UserFriendsController],
  exports: [UserFriendsService],
})
export class UserFriendsModule {}
