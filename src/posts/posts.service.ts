import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
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
import { UserFriendsService } from 'user-friends/user-friends.service';
import { ProfilesService } from 'profiles/profiles.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private assetsService: AssetsService,
    private cloudinary: CloudinaryService,
    private postImagesService: PostImagesService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private userFriendsService: UserFriendsService,
  ) {}

  async getBasePostById(id) {
    const post = await this.postRepository.findOneBy({
      id,
    });
    if (!post) {
      throw new UnauthorizedException('Post not found...');
    }
    return post;
  }

  // lay bai viet theo postId
  async getPostByPostId(postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: [
        'images',
        'images.image',
        'user',
        'user.profile',
        'user.profile.avatar',
        'likes',
        'likes.user',
      ],
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
      user: {
        id: post.user.id,
        profile: {
          id: post.user.profile.id,
          firstName: post.user.profile.firstName,
          lastName: post.user.profile.lastName,
          avatar: {
            id: post.user.profile.avatar.id,
            url: post.user.profile.avatar.url,
          },
        },
      },
      likes: post.likes.map((like) => ({
        userId: like.user.id,
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
    const user = await this.usersService.getUserById(userId);
    const profile = await this.profilesService.getProfileByUserId(userId);
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
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: user.id,
        profile: {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: {
            id: profile.avatar.id,
            url: profile.avatar.url,
          },
        },
      },
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
    const user = await this.usersService.getUserById(userId);
    const profile = await this.profilesService.getProfileByUserId(userId);
    const post = await this.createPost(user, content);

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: user.id,
        profile: {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: {
            id: profile.avatar.id,
            url: profile.avatar.url,
          },
        },
      },
    };
  }

  // lay danh sach bai viet theo user id
  async getListPostsByUser(
    userId: number,
    cursor?: number,
  ): Promise<GetPostResponseDto[]> {
    {
      const limit: number = 10;

      const listPosts = await this.postRepository.find({
        where: cursor
          ? { user: { id: userId }, id: LessThan(cursor) }
          : { user: { id: userId } },
        // where: { user: { id: userId } },
        relations: ['images', 'images.image', 'likes', 'likes.user'],
        order: {
          updatedAt: 'DESC',
        },
        take: limit,
      });
      if (!listPosts) {
        throw new UnauthorizedException('List posts not found...');
      }

      return listPosts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        images: post.images.map((image) => ({
          id: image.image.id,
          url: image.image.url,
        })),
        likes: post.likes.map((like) => ({
          userId: like.user.id,
        })),
      }));
    }
  }

  // xoa bai viet
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

  // lay danh sach bai viet theo owner and friends
  async getListPostsByOwnerAndFriends(ownerId: number, cursor?: number) {
    const limit: number = 10;
    // lấy danh sach ban be
    const userFriends = await this.userFriendsService.getListFriends(ownerId);

    // lay ra danh sach id cua ban be
    const userFriendIds = userFriends.map((userFriend) => {
      return userFriend.friend.id;
    });

    // them owner id vao
    const ownerIdAndUserFriendIds = [ownerId, ...userFriendIds];

    const listPosts = await this.postRepository.find({
      where: cursor
        ? { user: In(ownerIdAndUserFriendIds), id: LessThan(cursor) }
        : { user: In(ownerIdAndUserFriendIds) },
      relations: [
        'images',
        'images.image',
        'user',
        'user.profile',
        'user.profile.avatar',
        'likes',
        'likes.user',
      ],
      order: {
        updatedAt: 'DESC',
      },
      take: limit,
    });
    if (!listPosts) {
      throw new UnauthorizedException('List posts not found...');
    }

    return listPosts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      images: post.images.map((image) => ({
        id: image.image.id,
        url: image.image.url,
      })),
      user: {
        id: post.user.id,
        profile: {
          id: post.user.profile.id,
          firstName: post.user.profile.firstName,
          lastName: post.user.profile.lastName,
          avatar: {
            id: post.user.profile.avatar.id,
            url: post.user.profile.avatar.url,
          },
        },
      },
      likes: post.likes.map((like) => ({
        userId: like.user.id,
      })),
    }));
  }

  // lay ra userId theo postId
  async getUserIdByPostId(postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    return post.user.id;
  }
}
