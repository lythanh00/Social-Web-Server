import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';

import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard)
  @Post('like-post/:postId')
  async likePost(@Request() req, @Param('postId') postId: number) {
    return this.likesService.likePost(req.user.id, postId);
  }

  @UseGuards(AuthGuard)
  @Delete('unlike-post/:postId')
  async unlikePost(@Request() req, @Param('postId') postId: number) {
    return this.likesService.unlikePost(req.user.id, postId);
  }
  @UseGuards(AuthGuard)
  @Get('list-likes/:postId')
  async getListLikesOfPost(@Param('postId') postId: number) {
    return this.likesService.getListLikesOfPost(postId);
  }
}
