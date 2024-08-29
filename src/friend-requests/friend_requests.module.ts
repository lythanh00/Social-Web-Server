import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './friend_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [],
  controllers: [],
})
export class FriendRequestsModule {}
