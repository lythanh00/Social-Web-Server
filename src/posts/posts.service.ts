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

  async createPost(user: User, content: string) {
    const post = await this.postRepository.create({ user, content });
    return this.postRepository.save(post);
  }

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
}
