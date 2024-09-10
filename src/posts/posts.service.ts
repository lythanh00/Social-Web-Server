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
import { UpdatePostDto } from './dtos/update-post.dto';
import { UpdatePostResponseDto } from './dtos/update-post-response.dto';

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

  // lay bai viet theo id
  async getPostById(id) {
    const post = await this.postRepository.findOneBy({
      id,
    });
    if (!post) {
      throw new UnauthorizedException('Post not found...');
    }
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
  }

  // tao bai viet co ban
  async createPost(user: User, content: string) {
    const post = await this.postRepository.create({ user, content });
    return this.postRepository.save(post);
  }

  // update bai viet co ban
  async updatePost(userId: number, postId, content: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
    if (!post) {
      throw new UnauthorizedException(
        'Post not found or you do not have permission to update this post.',
      );
    }
    if (content) {
      await Object.assign(post, { content });
      return this.postRepository.save(post);
    }
    return post;
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
      content: post.content,
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
      content: post.content,
      createdAt: post.createdAt,
    };
  }

  // lay danh sach bai viet theo user id
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

  async removePost(userId: number, postId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });
    if (!post) {
      throw new UnauthorizedException(
        'Post not found or you do not have permission to delete this post.',
      );
    }
    await this.postRepository.softDelete(post.id); // Soft delete với TypeORM
    return true;
  }

  // sua bai viet co them hinh anh
  async updatePostWithImages(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
    files: Express.Multer.File[],
  ): Promise<UpdatePostResponseDto> {
    const content = updatePostDto.content;

    const post = await this.updatePost(userId, postId, content);

    // lay cac hinh anh co san cua bai viet
    const postWithImages =
      await this.postImagesService.getListPostImages(postId);

    const images: Asset[] = postWithImages.map((postImage) => postImage.image);

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
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      images: images.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    };
  }

  // sua bai viet khong them hinh anh
  async updatePostNoImages(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    const content = updatePostDto.content;
    const post = await this.updatePost(userId, postId, content);
    const postWithImages =
      await this.postImagesService.getListPostImages(postId);

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      images: postWithImages.map((image) => ({
        id: image.id,
        url: image.image.url,
      })),
    };
  }
}
