import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../database/like.entity';
import { PostsService } from 'posts/posts.service';
import { UsersService } from 'users/users.service';
import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

  async createLike(post: Post, user: User): Promise<Like> {
    const like = this.likeRepository.create({ post, user });
    return this.likeRepository.save(like);
  }

  async removeLike(existingLike): Promise<boolean> {
    await this.likeRepository.softDelete(existingLike.id); // Soft delete với TypeORM
    return true;
  }

  async likePost(userId: number, postId: number): Promise<{ message: string }> {
    const post = await this.postsService.getBasePostById(postId);
    const user = await this.usersService.getUserById(userId);

    if (!post || !user) {
      throw new NotFoundException('Post or User not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      withDeleted: true, // Bao gồm cả những bản ghi đã bị soft delete
    });

    if (existingLike) {
      if (existingLike.deletedAt) {
        // Phục hồi lại nếu đã bị soft delete
        existingLike.deletedAt = null;
        await this.likeRepository.save(existingLike);
        return { message: 'You have successfully liked the post again.' };
      } else {
        throw new BadRequestException('User already liked this post');
      }
    } else {
      const like = this.createLike(post, user);
      return { message: 'You have successfully liked the post.' };
    }
  }

  async unlikePost(
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const post = await this.postsService.getBasePostById(postId);
    const user = await this.usersService.getUserById(userId);

    if (!post || !user) {
      throw new NotFoundException('Post or User not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId }, deletedAt: null },
    });

    if (!existingLike) {
      throw new BadRequestException('User has not liked this post');
    }
    await this.removeLike(existingLike);
    return { message: 'You have successfully unliked the post.' };
  }
}
