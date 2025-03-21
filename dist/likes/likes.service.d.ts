import { Repository } from 'typeorm';
import { Like } from '../database/like.entity';
import { PostsService } from 'posts/posts.service';
import { UsersService } from 'users/users.service';
import { Post } from 'database/post.entity';
import { User } from 'database/user.entity';
import { UserLikePostResponseDto } from './dtos/user-like-post-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
import { NotificationsService } from 'notifications/notifications.service';
export declare class LikesService {
    private likeRepository;
    private postsService;
    private usersService;
    private profilesService;
    private notificationsService;
    constructor(likeRepository: Repository<Like>, postsService: PostsService, usersService: UsersService, profilesService: ProfilesService, notificationsService: NotificationsService);
    getLikeByOwner(postId: number, userId: number): Promise<Like>;
    createLike(post: Post, user: User): Promise<Like>;
    removeLike(existingLike: any): Promise<boolean>;
    getListLikesOfPost(postId: number, cursor?: number): Promise<UserLikePostResponseDto[]>;
    likePost(ownerId: number, postId: number): Promise<{
        message: string;
    }>;
    unlikePost(userId: number, postId: number): Promise<{
        message: string;
    }>;
}
