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
import { CommentsService } from './comments.service';

import { AuthGuard } from 'auth/guard/auth.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Get('get-comments-post/:postId')
  async getCommentsByPost(
    @Param('postId') postId: number,
    @Query('cursor') cursor: number,
  ) {
    return this.commentsService.getCommentsByPost(postId, cursor);
  }

  @UseGuards(AuthGuard)
  @Post('create-comment-post/:postId')
  async createCommentPost(
    @Request() req,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createCommentPost(
      req.user.id,
      postId,
      createCommentDto.content,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update-comment-post/:commentId')
  async updateCommentPost(
    @Request() req,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateCommentPost(
      req.user.id,
      commentId,
      updateCommentDto.content,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('remove-comment-post/:commentId')
  async removeCommentPost(
    @Request() req,
    @Param('commentId') commentId: number,
  ) {
    return this.commentsService.removeCommentPost(commentId, req.user.id);
  }
}
