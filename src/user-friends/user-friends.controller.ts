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

  @UseGuards(AuthGuard)
  @Get('is-friend/:friendId')
  async isFriend(
    @Request() req,
    @Param('friendId') friendId: number,
  ): Promise<boolean> {
    return this.userFriendsService.isFriend(req.user.id, friendId);
  }

  @UseGuards(AuthGuard)
  @Get('list-friends-by-user/:userId')
  async getFriendsByUser(@Param('userId') userId: number) {
    return this.userFriendsService.getListFriends(userId);
  }

  @UseGuards(AuthGuard)
  @Get('count-friends-by-owner')
  async countFriendsByOwner(@Request() req) {
    return this.userFriendsService.countFriendsByUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('count-friends-by-user/:userId')
  async countFriendsByUser(@Param('userId') userId: number) {
    return this.userFriendsService.countFriendsByUser(userId);
  }
}
