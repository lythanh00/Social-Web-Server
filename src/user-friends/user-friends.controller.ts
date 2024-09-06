import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserFriendsService } from './user-friends.service';
import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('user-friends')
export class UserFriendsController {
  constructor(private readonly userFriendsService: UserFriendsService) {}
  @UseGuards(AuthGuard)
  @Get('list-friends')
  async getFriends(@Request() req) {
    return this.userFriendsService.getListFriends(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete('remove-friend')
  async removeFriend(@Request() req, @Body('friendId') friendId: number) {
    return this.userFriendsService.removeFriend(req.user.id, friendId);
  }
}
