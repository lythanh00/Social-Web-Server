import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '../database/profile.entity';
import { AuthGuard } from 'auth/guard/auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('req', req.user.id);
    return this.profilesService.getProfile(req.user.id);
  }
}
