import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from '../database/post.entity';
import { User } from 'database/user.entity';

import { AssetsService } from 'assets/assets.service';
import { Asset } from 'database/asset.entity';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { UsersService } from 'users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostImagesService } from 'post-images/post-images.service';
import { CreatePostResponseDto } from './dtos/create-post-response.dto';
import { GetPostResponseDto } from './dtos/get-post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private assetsService: AssetsService,
    private cloudinary: CloudinaryService,
    private postImagesService: PostImagesService,
    private usersService: UsersService,
  ) {}

  // tao bai viet co ban
  async createPost(user: User, content: string) {
    const post = await this.postRepository.create({ user, content });
    return this.postRepository.save(post);
  }

  // tao bai viet co hinh anh
  async createPostWithImages(
    userId: number,
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<CreatePostResponseDto> {
    const content = createPostDto.content;
    const user = await this.usersService.findUserById(userId);
    const post = await this.createPost(user, content);
    const images: Asset[] = [];
    for (const file of files) {
      const upload = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      const image = await this.assetsService.createAsset(upload.url);
      if (!image) {
        throw new UnauthorizedException('Image not created');
      }
      const postImage = await this.postImagesService.createPostImage(
        post,
        image,
      );
      images.push(postImage.image);
    }
    return {
      id: post.id,
      user: {
        id: user.id,
      },
      content,
      createdAt: post.createdAt,
      images: images.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    };
  }

  // tao bai viet khong hinh anh
  async createPostNoImages(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<CreatePostResponseDto> {
    const content = createPostDto.content;
    const user = await this.usersService.findUserById(userId);
    const post = await this.createPost(user, content);

    return {
      id: post.id,
      user: {
        id: user.id,
      },
      content,
      createdAt: post.createdAt,
    };
  }

  async getListPostsByUser(userId): Promise<GetPostResponseDto[]> {
    {
      const listPosts = await this.postRepository.find({
        where: { user: { id: userId } },
      });
      if (!listPosts) {
        throw new UnauthorizedException('List posts not found...');
      }

      const listPostsWithImages = await Promise.all(
        listPosts.map(async (post) => {
          const postWithImages = await this.postImagesService.getListPostImages(
            post.id,
          );
          return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updateAt: post.updatedAt,
            images: postWithImages.map((image) => ({
              id: image.id,
              url: image.image.url,
            })),
          };
        }),
      );

      return listPostsWithImages;
    }
  }
}
