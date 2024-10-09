import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../database/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ChatsModule } from 'chats/chats.module';
import { UsersModule } from 'users/users.module';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { AssetsModule } from 'assets/assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ChatsModule,
    UsersModule,
    CloudinaryModule,
    AssetsModule,
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
