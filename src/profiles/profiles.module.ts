import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../database/profile.entity';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

import { User } from 'database/user.entity';
import { UsersModule } from 'users/users.module';
import { AssetsModule } from 'assets/assets.module';
import { CloudinaryModule } from 'cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, User]),
    AssetsModule,
    CloudinaryModule,
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
