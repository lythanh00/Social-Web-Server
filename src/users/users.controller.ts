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

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  //   @Post()
  //   async create(@Body() user: User): Promise<User> {
  //     // Assuming you have a create method in your service
  //     return this.usersService.create(user);
  //   }
}
