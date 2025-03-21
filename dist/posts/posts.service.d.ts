import { Repository } from 'typeorm';
import { Post } from '../database/post.entity';
import { User } from 'database/user.entity';
import { AssetsService } from 'assets/assets.service';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { UsersService } from 'users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostImagesService } from 'post-images/post-images.service';
import { CreatePostResponseDto } from './dtos/create-post-response.dto';
import { GetPostResponseDto } from './dtos/get-post-response.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UpdatePostResponseDto } from './dtos/update-post-response.dto';
import { UserFriendsService } from 'user-friends/user-friends.service';
import { ProfilesService } from 'profiles/profiles.service';
export declare class PostsService {
    private postRepository;
    private assetsService;
    private cloudinary;
    private postImagesService;
    private usersService;
    private profilesService;
    private userFriendsService;
    constructor(postRepository: Repository<Post>, assetsService: AssetsService, cloudinary: CloudinaryService, postImagesService: PostImagesService, usersService: UsersService, profilesService: ProfilesService, userFriendsService: UserFriendsService);
    getBasePostById(id: any): Promise<Post>;
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
    createPost(user: User, content: string): Promise<Post>;
    updatePost(userId: number, postId: any, content: string): Promise<Post>;
    createPostWithImages(userId: number, createPostDto: CreatePostDto, files: Express.Multer.File[]): Promise<CreatePostResponseDto>;
    createPostNoImages(userId: number, createPostDto: CreatePostDto): Promise<CreatePostResponseDto>;
    getListPostsByUser(userId: number, cursor?: number): Promise<GetPostResponseDto[]>;
    removePost(userId: number, postId: number): Promise<boolean>;
    updatePostWithImages(userId: number, postId: number, updatePostDto: UpdatePostDto, files: Express.Multer.File[]): Promise<UpdatePostResponseDto>;
    updatePostNoImages(userId: number, postId: number, updatePostDto: UpdatePostDto): Promise<UpdatePostResponseDto>;
    getListPostsByOwnerAndFriends(ownerId: number, cursor?: number): Promise<{
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
    getUserIdByPostId(postId: number): Promise<number>;
}
