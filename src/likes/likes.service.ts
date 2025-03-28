import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Like } from '../database/like.entity';
import { PostsService } from 'posts/posts.service';
import { UsersService } from 'users/users.service';
import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';
import { UserLikePostResponseDto } from './dtos/user-like-post-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private postsService: PostsService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private notificationsService: NotificationsService,
  ) {}

  // kiểm tra xem owner đã like chưa
  async getLikeByOwner(postId: number, userId: number): Promise<Like> {
    return await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId }, deletedAt: null },
    });
  }

  async createLike(post: Post, user: User): Promise<Like> {
    const like = this.likeRepository.create({ post, user });
    return this.likeRepository.save(like);
  }

  async removeLike(existingLike): Promise<boolean> {
    await this.likeRepository.softDelete(existingLike.id); // Soft delete với TypeORM
    return true;
  }

  async getListLikesOfPost(
    postId: number,
    cursor?: number,
  ): Promise<UserLikePostResponseDto[]> {
    const limit: number = 10;
    const post = await this.postsService.getBasePostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const listLikes = await this.likeRepository.find({
      where: cursor
        ? { post: { id: postId }, id: LessThan(cursor) }
        : { post: { id: postId } },
      relations: ['user', 'user.profile', 'user.profile.avatar'],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    return listLikes.map((like) => ({
      id: like.id,
      user: {
        id: like.user.id,
        profile: {
          firstName: like.user.profile.firstName,
          lastName: like.user.profile.lastName,
          avatar: {
            url: like.user.profile.avatar.url,
          },
        },
      },
    }));
  }

  async likePost(
    ownerId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const post = await this.postsService.getBasePostById(postId);
    const owner = await this.usersService.getUserById(ownerId);

    if (!post || !owner) {
      throw new NotFoundException('Post or Owner not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: ownerId } },
      withDeleted: true, // Bao gồm cả những bản ghi đã bị soft delete
    });

    if (existingLike) {
      if (existingLike.deletedAt) {
        // Phục hồi lại nếu đã bị soft delete
        existingLike.deletedAt = null;
        await this.likeRepository.save(existingLike);
        return { message: 'You have successfully liked the post again.' };
      } else {
        throw new BadRequestException('You already liked this post');
      }
    } else {
      const like = await this.createLike(post, owner);

      const userId = await this.postsService.getUserIdByPostId(postId);
      if (ownerId !== userId) {
        const notification = await this.notificationsService.createNotification(
          ownerId,
          userId,
          'like',
          like.id,
          null,
          null,
        );
      }
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

    const existingLike = await this.getLikeByOwner(postId, userId);

    if (!existingLike) {
      throw new BadRequestException('User has not liked this post');
    }
    await this.removeLike(existingLike);
    return { message: 'You have successfully unliked the post.' };
  }
}
