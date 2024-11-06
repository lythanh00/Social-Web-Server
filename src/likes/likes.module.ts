import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../database/like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PostsModule } from 'posts/posts.module';
import { ProfilesModule } from 'profiles/profiles.module';
import { UsersModule } from 'users/users.module';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    PostsModule,
    UsersModule,
    ProfilesModule,
    NotificationsModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
