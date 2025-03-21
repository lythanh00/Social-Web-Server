import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getCommentsByPost(postId: number, cursor: number): Promise<import("./dtos/get-comment-response.dto").GetCommentResponseDto[]>;
    createCommentPost(req: any, postId: number, createCommentDto: CreateCommentDto): Promise<import("./dtos/create-comment-response.dto").CreateCommentResponseDto>;
    updateCommentPost(req: any, commentId: number, updateCommentDto: UpdateCommentDto): Promise<import("./dtos/update-comment-response.dto").UpdatecommentResponseDto>;
    removeCommentPost(req: any, commentId: number): Promise<{
        message: string;
    }>;
}
