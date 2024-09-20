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
import { SearchProfileResponseDto } from './dtos/search-profile-response.dto';
import { GetProfileResponseDto } from './dtos/get-profile-response.dto';

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
  async getProfileByUserId(userId): Promise<GetProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['avatar', 'coverPhoto', 'user'], // Tự động tải avatar và coverPhoto
    });
    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      avatar: profile.avatar,
      coverPhoto: profile.coverPhoto,
      userId: profile.user.id,
    };
  }

  // get profile by profile id
  async getProfileByProfileId(profileId): Promise<GetProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['avatar', 'coverPhoto', 'user'], // Tự động tải avatar và coverPhoto
    });
    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      avatar: profile.avatar,
      coverPhoto: profile.coverPhoto,
      userId: profile.user.id,
    };
  }

  //Update profile
  async updateProfile(userId, updateProfileDto: UpdateProfileDto) {
    const profile = await this.getProfileByUserId(userId);

    if (!profile) {
      throw new UnauthorizedException('Profile not found...');
    }

    await Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  async updateAvatarProfile(userId, file: Express.Multer.File) {
    const profile = await this.getProfileByUserId(userId);

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
    const profile = await this.getProfileByUserId(userId);

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
    return this.getProfileByUserId(user.id);
  }

  async findProfilesByName(name: string): Promise<SearchProfileResponseDto[]> {
    const profiles = await this.profileRepository.find({
      where: [
        { firstName: ILike(`%${name}%`) },
        { lastName: ILike(`%${name}%`) },
      ],
      relations: ['avatar', 'user'],
    });
    return profiles.map((profile) => ({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,

      avatar: {
        id: profile.avatar.id,
        url: profile.avatar.url,
      },

      userId: profile.user.id,
    }));
  }
}
