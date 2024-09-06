import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { User } from '../database/user.entity';

@Controller('user-friends')
export class UserFriendsController {}
