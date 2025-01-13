import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../database/chat.entity';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { UsersModule } from 'users/users.module';
import { ProfilesModule } from 'profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule, ProfilesModule],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
