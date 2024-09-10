import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../database/user.entity';
import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
