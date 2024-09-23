import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Delete,
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

  @UseGuards(AuthGuard)
  @Get('is-pending-friend-request/:receiverId')
  async checkIsPendingFriendRequest(
    @Request() req,
    @Param('receiverId') receiverId: number,
  ): Promise<boolean> {
    return this.friendRequestsService.isPendingFriendRequest(
      req.user.id,
      receiverId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('remove-friend-request')
  async removeFriendRequest(
    @Request() req,
    @Body('receiverId') receiverId: number,
  ) {
    return this.friendRequestsService.removeFriendRequest(
      req.user.id,
      receiverId,
    );
  }
}
