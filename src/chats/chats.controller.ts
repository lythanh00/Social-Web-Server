import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @UseGuards(AuthGuard)
  @Post('create-chat')
  async createChat(
    @Request() req,
    @Body('participant2Id') participant2Id: number,
  ) {
    return await this.chatsService.createChat(req.user.id, participant2Id);
  }
}
