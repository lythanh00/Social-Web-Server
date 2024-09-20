import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Profile } from '../database/profile.entity';
import { User } from 'database/user.entity';

import { AssetsService } from 'assets/assets.service';
import { Asset } from 'database/asset.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private assetsService: AssetsService,
    private cloudinary: CloudinaryService,
    private usersService: UsersService,
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
      throw new UnauthorizedException('Profile not found...');
    }
    return profile;
  }

  // get profile by profile id
  async getProfileByProfileId(profileId) {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['avatar', 'coverPhoto'], // Tự động tải avatar và coverPhoto
    });
    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }
    return profile;
  }

  //Update profile
  async updateProfile(userId, updateProfileDto: UpdateProfileDto) {
    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }

    await Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  async updateAvatarProfile(userId, file: Express.Multer.File) {
    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }

    const upload = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });

    const avatar = await this.assetsService.createAsset(upload.url);

    if (!avatar) {
      throw new UnauthorizedException('Avatar profile not update');
    }

    await Object.assign(profile, { avatar });
    return this.profileRepository.save(profile);
  }

  async updateCoverPhotoProfile(userId, file: Express.Multer.File) {
    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }

    const upload = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });

    const coverPhoto = await this.assetsService.createAsset(upload.url);

    if (!coverPhoto) {
      throw new UnauthorizedException('Cover Photo profile not update');
    }

    await Object.assign(profile, { coverPhoto });
    return this.profileRepository.save(profile);
  }

  async findProfileByEmail(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.getProfile(user.id);
  }

  async findProfilesByName(name: string): Promise<Profile[]> {
    return this.profileRepository.find({
      where: [
        { firstName: ILike(`%${name}%`) },
        { lastName: ILike(`%${name}%`) },
      ],
      relations: ['avatar'],
    });
  }
}
