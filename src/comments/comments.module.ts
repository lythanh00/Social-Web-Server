import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../database/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsModule } from 'posts/posts.module';
import { UsersModule } from 'users/users.module';
import { CommentsGateway } from './comments.gateway';
import { ProfilesModule } from 'profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PostsModule,
    UsersModule,
    ProfilesModule,
  ],
  providers: [CommentsService, CommentsGateway],
  controllers: [CommentsController],
})
export class CommentsModule {}
