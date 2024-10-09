import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
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
}
