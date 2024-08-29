// src/database/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'users/user.entity';
import { Asset } from 'assets/asset.entity';
import { UserFriend } from 'user-friends/user-friend.entity';
import { FriendRequest } from 'friend-requests/friend_request.entity';
import { Profile } from 'profiles/profile.entity';
import { Post } from 'posts/post.entity';
import { PostImage } from 'post-images/post-image.entity';
import { Comment } from 'comments/comment.entity';
import { Like } from 'likes/like.entity';
import { Chat } from 'chats/chat.entity';
import { Message } from 'messages/message.entity';
import { Notification } from 'notifications/notification.entity';

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '070902',
    database: 'social_web',
    entities: [
      User,
      Asset,
      UserFriend,
      FriendRequest,
      Profile,
      Post,
      PostImage,
      Comment,
      Like,
      Chat,
      Message,
      Notification,
    ], // Danh sách các entity
    synchronize: true, // Chỉ dùng trong môi trường phát triển
  }),
  inject: [ConfigService],
};
