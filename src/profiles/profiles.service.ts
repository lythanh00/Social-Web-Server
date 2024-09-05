import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/profile.entity';
import { User } from 'database/user.entity';

import { AssetsService } from 'assets/assets.service';
import { Asset } from 'database/asset.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private assetsService: AssetsService,
  ) {}

  async createProfile(
    user: User,
    avatar: Asset,
    coverPhoto: Asset,
  ): Promise<Profile> {
    const profile = this.profileRepository.create({ user, avatar, coverPhoto });
    return this.profileRepository.save(profile);
  }
  async getProfile(userId) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['avatar', 'coverPhoto'], // Tự động tải avatar và coverPhoto
    });
    if (!profile) {
      throw new UnauthorizedException('User not found...');
    }

    return profile;
  }
}
