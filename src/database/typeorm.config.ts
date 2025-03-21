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
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const databaseConfig = {
      host: configService.get<string>('MYSQLHOST'),
      port: Number(configService.get<number>('MYSQLPORT')) || 3306,
      username: configService.get<string>('MYSQLUSER'),
      password: configService.get<string>('MYSQLPASSWORD'),
      database: configService.get<string>('MYSQL_DATABASE'),
    };

    console.log('Database Config:', databaseConfig); // Log thông tin cấu hình

    return {
      ...databaseConfig,
      type: 'mysql',
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
      ],
      synchronize: true, // Chỉ dùng trong môi trường phát triển
      ssl: {
        rejectUnauthorized: false, // Cần thiết khi sử dụng Railway hoặc SSL
      },
    };
  },
  inject: [ConfigService],
};
