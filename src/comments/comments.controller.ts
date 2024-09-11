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
import { CreateCommentDto } from './dtos/create-comment-post.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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

  //   @UseGuards(AuthGuard)
  //   @Put('update-comment-post/:commentId')
  //   async updateComment(
  //     @Request() req,
  //     @Param('commentId') commentId: number,
  //     @Body() updateCommentDto: UpdateCommentDto,
  //   ) {
  //     return this.commentsService.updateComment(
  //       commentId,
  //       req.user.id,
  //       updateCommentDto.content,
  //     );
  //   }
}
