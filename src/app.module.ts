import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { LoggerModule } from './logger/logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/typeorm.config'; // Import cấu hình async
import { PostsModule } from 'posts/posts.module';
import { UsersModule } from 'users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'auth/mailer/mailer.module';
import { ProfilesModule } from 'profiles/profiles.module';
import { AssetsModule } from 'assets/assets.module';
import { FriendRequestsModule } from 'friend-requests/friend-requests.module';
import { LikesModule } from 'likes/likes.module';
import { CommentsModule } from 'comments/comments.module';
import { ChatsModule } from 'chats/chats.module';
import { MessagesModule } from 'messages/messages.module';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    // ConfigModule.forRoot({ ignoreEnvFile: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UsersModule,
    JwtModule,
    MailerModule,
    ProfilesModule,
    AssetsModule,
    FriendRequestsModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    ChatsModule,
    MessagesModule,
    NotificationsModule,
    // SendgridModule,
    LoggerModule.forRoot(),
    // ConfigModule, // Import ConfigModule để sử dụng ConfigService
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
