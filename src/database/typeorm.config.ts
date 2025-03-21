// src/database/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'database/user.entity';
import { Asset } from 'database/asset.entity';
import { UserFriend } from 'database/user-friend.entity';
import { FriendRequest } from 'database/friend-request.entity';
import { Profile } from 'database/profile.entity';
import { Post } from 'database/post.entity';
import { PostImage } from 'database/post-image.entity';
import { Comment } from 'database/comment.entity';
import { Like } from 'database/like.entity';
import { Chat } from 'database/chat.entity';
import { Message } from 'database/message.entity';
import { Notification } from 'database/notification.entity';

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    // host: 'localhost',
    // port: 3306,
    // username: 'root',
    // password: '070902',
    // database: 'social_web',
    host: configService.get<string>('MYSQLHOST'),
    port: Number(configService.get<string>('MYSQLPORT')) || 3306,
    username: configService.get<string>('MYSQLUSER'),
    password: configService.get<string>('MYSQLPASSWORD'),
    database: configService.get<string>('MYSQL_DATABASE'),
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
    synchronize: true, // Chỉ dùng trong môi trường phát triển tự động tạo các bảng
  }),
  inject: [ConfigService],
};
