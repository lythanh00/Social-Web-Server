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
import { NotificationsService } from 'notifications/notifications.service';
export declare class CommentsService {
    private commentRepository;
    private postsService;
    private usersService;
    private profilesService;
    private notificationsService;
    constructor(commentRepository: Repository<Comment>, postsService: PostsService, usersService: UsersService, profilesService: ProfilesService, notificationsService: NotificationsService);
    createComment(post: Post, user: User, content: string): Promise<Comment>;
    getCommentsByPost(postId: number, cursor?: number): Promise<GetCommentResponseDto[]>;
    createCommentPost(ownerId: number, postId: number, content: string): Promise<CreateCommentResponseDto>;
    updateCommentPost(userId: number, commentId: number, content: string): Promise<UpdatecommentResponseDto>;
    removeCommentPost(commentId: number, userId: number): Promise<{
        message: string;
    }>;
}
