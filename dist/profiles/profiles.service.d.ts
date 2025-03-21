import { Repository } from 'typeorm';
import { Profile } from '../database/profile.entity';
import { User } from 'database/user.entity';
import { AssetsService } from 'assets/assets.service';
import { Asset } from 'database/asset.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { UsersService } from 'users/users.service';
import { SearchProfileResponseDto } from './dtos/search-profile-response.dto';
import { GetProfileResponseDto } from './dtos/get-profile-response.dto';
export declare class ProfilesService {
    private profileRepository;
    private assetsService;
    private cloudinary;
    private usersService;
    constructor(profileRepository: Repository<Profile>, assetsService: AssetsService, cloudinary: CloudinaryService, usersService: UsersService);
    createProfile(user: User, avatar: Asset, coverPhoto: Asset): Promise<Profile>;
    getProfileByUserId(userId: any): Promise<GetProfileResponseDto>;
    updateProfile(userId: any, updateProfileDto: UpdateProfileDto): Promise<GetProfileResponseDto & Profile>;
    updateAvatarProfile(userId: any, file: Express.Multer.File): Promise<GetProfileResponseDto & Profile>;
    updateCoverPhotoProfile(userId: any, file: Express.Multer.File): Promise<GetProfileResponseDto & Profile>;
    findProfileByEmail(email: string): Promise<GetProfileResponseDto>;
    findProfilesByName(name: string): Promise<SearchProfileResponseDto[]>;
}
