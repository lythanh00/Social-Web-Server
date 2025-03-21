"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("../database/profile.entity");
const assets_service_1 = require("../assets/assets.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const users_service_1 = require("../users/users.service");
let ProfilesService = class ProfilesService {
    constructor(profileRepository, assetsService, cloudinary, usersService) {
        this.profileRepository = profileRepository;
        this.assetsService = assetsService;
        this.cloudinary = cloudinary;
        this.usersService = usersService;
    }
    async createProfile(user, avatar, coverPhoto) {
        const profile = this.profileRepository.create({ user, avatar, coverPhoto });
        return this.profileRepository.save(profile);
    }
    async getProfileByUserId(userId) {
        const profile = await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['avatar', 'coverPhoto', 'user'],
        });
        if (!profile) {
            throw new common_1.UnauthorizedException('Profile not found...');
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
    async updateProfile(userId, updateProfileDto) {
        const profile = await this.getProfileByUserId(userId);
        if (!profile) {
            throw new common_1.UnauthorizedException('Profile not found...');
        }
        await Object.assign(profile, updateProfileDto);
        return this.profileRepository.save(profile);
    }
    async updateAvatarProfile(userId, file) {
        const profile = await this.getProfileByUserId(userId);
        if (!profile) {
            throw new common_1.UnauthorizedException('Profile not found...');
        }
        const upload = await this.cloudinary.uploadImage(file).catch(() => {
            throw new common_1.BadRequestException('Invalid file type.');
        });
        const avatar = await this.assetsService.createAsset(upload.url);
        if (!avatar) {
            throw new common_1.UnauthorizedException('Avatar profile not update');
        }
        await Object.assign(profile, { avatar });
        return this.profileRepository.save(profile);
    }
    async updateCoverPhotoProfile(userId, file) {
        const profile = await this.getProfileByUserId(userId);
        if (!profile) {
            throw new common_1.UnauthorizedException('Profile not found...');
        }
        const upload = await this.cloudinary.uploadImage(file).catch(() => {
            throw new common_1.BadRequestException('Invalid file type.');
        });
        const coverPhoto = await this.assetsService.createAsset(upload.url);
        if (!coverPhoto) {
            throw new common_1.UnauthorizedException('Cover Photo profile not update');
        }
        await Object.assign(profile, { coverPhoto });
        return this.profileRepository.save(profile);
    }
    async findProfileByEmail(email) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.getProfileByUserId(user.id);
    }
    async findProfilesByName(name) {
        const profiles = await this.profileRepository.find({
            where: [
                { firstName: (0, typeorm_2.ILike)(`%${name}%`) },
                { lastName: (0, typeorm_2.ILike)(`%${name}%`) },
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
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        assets_service_1.AssetsService,
        cloudinary_service_1.CloudinaryService,
        users_service_1.UsersService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map