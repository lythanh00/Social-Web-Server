import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '../database/profile.entity';
import { AuthGuard } from 'auth/guard/auth.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('req', req.user.id);
    return this.profilesService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put('update-profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ) {
    return this.profilesService.updateProfile(req.user.id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Post('update-avatar-profile')
  @UseInterceptors(FileInterceptor('avatar-profile'))
  async uploadAvatarProfile(
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
  ) {
    return this.profilesService.updateAvatarProfile(req.user.id, file);
  }

  @UseGuards(AuthGuard)
  @Post('update-coverphoto-profile')
  @UseInterceptors(FileInterceptor('coverphoto-profile'))
  async uploadCoverPhotoProfile(
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
  ) {
    return this.profilesService.updateCoverPhotoProfile(req.user.id, file);
  }

  @UseGuards(AuthGuard)
  @Get('search-profile-by-email')
  async searchProfileByEmail(@Query('email') email: string) {
    return this.profilesService.findProfileByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('search-profile-by-name')
  async searchProfileByName(@Query('name') name: string) {
    return this.profilesService.findProfilesByName(name);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProfileById(@Param('id') id: number): Promise<Profile> {
    return this.profilesService.getProfile(id);
  }
}
