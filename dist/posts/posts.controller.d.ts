import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(req: any, createPostDto: CreatePostDto, files: Express.Multer.File[]): Promise<import("./dtos/create-post-response.dto").CreatePostResponseDto>;
    getListPostsByOwner(req: any, cursor: number): Promise<import("./dtos/get-post-response.dto").GetPostResponseDto[]>;
    getListPostsByUser(userId: number, cursor: number): Promise<import("./dtos/get-post-response.dto").GetPostResponseDto[]>;
    getPostByPostId(postId: number): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updateAt: Date;
        images: {
            id: number;
            url: string;
        }[];
        user: {
            id: number;
            profile: {
                id: number;
                firstName: string;
                lastName: string;
                avatar: {
                    id: number;
                    url: string;
                };
            };
        };
        likes: {
            userId: number;
        }[];
    }>;
    removeFriend(req: any, postId: number): Promise<boolean>;
    updatePost(req: any, postId: number, updatePostDto: UpdatePostDto, files: Express.Multer.File[]): Promise<import("./dtos/update-post-response.dto").UpdatePostResponseDto>;
    getListPostsByOwnerAndFriends(req: any, cursor: number): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        images: {
            id: number;
            url: string;
        }[];
        user: {
            id: number;
            profile: {
                id: number;
                firstName: string;
                lastName: string;
                avatar: {
                    id: number;
                    url: string;
                };
            };
        };
        likes: {
            userId: number;
        }[];
    }[]>;
}
