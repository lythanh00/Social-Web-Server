import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostImage } from '../database/post-image.entity';

import { Asset } from 'database/asset.entity';

import { Post } from 'database/post.entity';

@Injectable()
export class PostImagesService {
  constructor(
    @InjectRepository(PostImage)
    private postImagesRepository: Repository<PostImage>,
  ) {}

  async createPostImage(post: Post, image: Asset): Promise<PostImage> {
    const postImage = this.postImagesRepository.create({ post, image });
    return this.postImagesRepository.save(postImage);
  }
}
