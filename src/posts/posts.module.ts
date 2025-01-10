import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../database/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';
import { AssetsModule } from 'assets/assets.module';
import { PostImagesModule } from 'post-images/post-images.module';
import { UsersModule } from 'users/users.module';
import { UserFriendsModule } from 'user-friends/user-friends.module';
import { ProfilesModule } from 'profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AssetsModule,
    CloudinaryModule,
    PostImagesModule,
    UsersModule,
    UserFriendsModule,
    ProfilesModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
