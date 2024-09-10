import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
  Request,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  BadRequestException,
  Delete,
} from '@nestjs/common';

import { User } from '../database/user.entity';
import { AuthGuard } from 'auth/guard/auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post('create-post')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // tối đa 10 hình ảnh
      limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước tệp là 5MB mỗi tệp
    }),
  )
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 1000000) {
          throw new BadRequestException('File size exceeds the limit of 1MB.');
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          throw new BadRequestException('Invalid file type.');
        }
      }
      return this.postsService.createPostWithImages(
        req.user.id,
        createPostDto,
        files,
      );
    }

    return this.postsService.createPostNoImages(req.user.id, createPostDto);
  }

  @UseGuards(AuthGuard)
  @Get('list-posts-by-owner')
  async getListPostsByOwner(@Request() req) {
    return this.postsService.getListPostsByUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('list-posts-by-user/:id')
  async getListPostsByUser(@Param('id') userId: number) {
    return this.postsService.getListPostsByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('get-post/:id')
  async getPostById(@Param('id') postId: number) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(AuthGuard)
  @Delete('remove-post')
  async removeFriend(
    @Request() req,
    @Body('postId') postId: number,
  ): Promise<boolean> {
    return this.postsService.removePost(req.user.id, postId);
  }
}
