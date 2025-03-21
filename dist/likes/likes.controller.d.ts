import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    likePost(req: any, postId: number): Promise<{
        message: string;
    }>;
    unlikePost(req: any, postId: number): Promise<{
        message: string;
    }>;
    getListLikesOfPost(postId: number, cursor: number): Promise<import("./dtos/user-like-post-response.dto").UserLikePostResponseDto[]>;
}
