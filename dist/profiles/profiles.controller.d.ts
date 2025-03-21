import { ProfilesService } from './profiles.service';
import { Profile } from '../database/profile.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { GetProfileResponseDto } from './dtos/get-profile-response.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(req: any): Promise<GetProfileResponseDto>;
    updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<GetProfileResponseDto & Profile>;
    uploadAvatarProfile(file: Express.Multer.File, req: any): Promise<GetProfileResponseDto & Profile>;
    uploadCoverPhotoProfile(file: Express.Multer.File, req: any): Promise<GetProfileResponseDto & Profile>;
    searchProfileByEmail(email: string): Promise<GetProfileResponseDto>;
    searchProfileByName(name: string): Promise<import("./dtos/search-profile-response.dto").SearchProfileResponseDto[]>;
    getProfileByUserId(userId: number): Promise<GetProfileResponseDto>;
}
