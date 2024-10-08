import {
  BadRequestException,
  ForbiddenException,
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
import { CreateCommentResponseDto } from './dtos/create-comment-response.dto';
import { UpdatecommentResponseDto } from './dtos/update-comment-response.dto';
import { GetCommentResponseDto } from './dtos/get-comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postsService: PostsService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
  ) {}

  async createComment(
    post: Post,
    user: User,
    content: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({ post, user, content });
    return this.commentRepository.save(comment);
  }

  async getCommentsByPost(postId: number): Promise<GetCommentResponseDto[]> {
    const post = await this.postsService.getBasePostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const listComments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post', 'user.profile', 'user.profile.avatar'], // Để lấy thông tin người dùng đã bình luận
    });

    return listComments.map((comment) => ({
      id: comment.id,
      post: {
        id: comment.post.id,
      },
      user: {
        id: comment.user.id,
        profile: {
          firstName: comment.user.profile.firstName,
          lastName: comment.user.profile.lastName,
          avatar: {
            url: comment.user.profile.avatar.url,
          },
        },
      },
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }

  async createCommentPost(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreateCommentResponseDto> {
    const post = await this.postsService.getBasePostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.usersService.getUserById(userId);
    const profile = await this.profilesService.getProfileByUserId(userId);

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
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: {
            url: profile.avatar.url,
          },
        },
      },
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async updateCommentPost(
    userId: number,
    commentId: number,
    content: string,
  ): Promise<UpdatecommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user: { id: userId } },
      relations: ['user', 'post'],
    });

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or You are not allowed to edit this comment',
      );
    }

    await Object.assign(comment, { content });
    const updatedComment = await this.commentRepository.save(comment);
    return {
      id: updatedComment.id,
      post: { id: updatedComment.post.id },
      user: { id: updatedComment.user.id },
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
  }

  async removeCommentPost(
    commentId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or You are not allowed to delete this comment',
      );
    }

    await this.commentRepository.softDelete(commentId);
    return { message: 'You have successfully delete the comment.' };
  }
}
