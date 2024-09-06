import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';

import { AuthGuard } from 'auth/guard/auth.guard';
import { FriendRequestsService } from './friend-requests.service';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}
  @UseGuards(AuthGuard)
  @Post('send')
  async sendFriendRequest(
    @Request() req,
    @Body('receiverId') receiverId: number,
  ) {
    return this.friendRequestsService.sendFriendRequest(
      req.user.id,
      receiverId,
    );
  }

  @UseGuards(AuthGuard)
  @Put('respond/:requestId')
  async respondToFriendRequest(
    @Param('requestId') requestId: number,
    @Body('accept') accept: boolean,
  ) {
    return this.friendRequestsService.respondToFriendRequest(requestId, accept);
  }
}
