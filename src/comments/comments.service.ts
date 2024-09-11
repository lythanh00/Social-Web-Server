import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../database/comment.entity';
import { PostsService } from 'posts/posts.service';
import { UsersService } from 'users/users.service';
import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';
import { ProfilesService } from 'profiles/profiles.service';
import { CreatecommentPostResponseDto } from './dtos/create-comment-post-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

  async createComment(
    post: Post,
    user: User,
    content: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({ post, user, content });
    return this.commentRepository.save(comment);
  }

  async createCommentPost(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreatecommentPostResponseDto> {
    const post = await this.postsService.getBasePostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = await this.createComment(post, user, content);
    return {
      id: comment.id,
      post: {
        id: post.id,
      },
      user: {
        id: user.id,
      },
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
