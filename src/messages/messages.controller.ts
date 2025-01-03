import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { AuthGuard } from 'auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @UseGuards(AuthGuard)
  @Post('send-message')
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return await this.messagesService.sendMessage(req.user.id, sendMessageDto);
  }

  @UseGuards(AuthGuard)
  @Post('send-image-message')
  @UseInterceptors(FileInterceptor('image-message'))
  async sendImageMessage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return await this.messagesService.sendImageMessage(
      req.user.id,
      file,
      sendMessageDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('list-messages-by-chat/:chatId')
  async getMessagesByChat(
    @Request() req,
    @Param('chatId') chatId: number,
    @Query('cursor') cursor: number,
  ) {
    return await this.messagesService.getMessagesByChat(chatId, cursor);
  }

  @UseGuards(AuthGuard)
  @Put('mark-message-as-read')
  async markMessageAsRead(@Request() req, @Body('chatId') chatId: number) {
    await this.messagesService.markAsRead(req.user.id, chatId);
    return true;
  }

  @UseGuards(AuthGuard)
  @Get('count-unread-chats')
  async countUnreadChats(@Request() req) {
    return await this.messagesService.countUnreadChats(req.user.id);
  }
}
