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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const mailer_service_1 = require("./mailer/mailer.service");
const profiles_service_1 = require("../profiles/profiles.service");
const assets_service_1 = require("../assets/assets.service");
const image_1 = require("../constant/image");
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailerService, profilesService, assetsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.profilesService = profilesService;
        this.assetsService = assetsService;
    }
    async login(email, password) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email');
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Email is not verifed');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const payload = { id: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '30d',
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async register(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const res = await this.usersService.getUserByEmail(email);
        if (res === null || res === void 0 ? void 0 : res.id) {
            throw new common_1.UnauthorizedException('email already in used');
        }
        try {
            const user = await this.usersService.createUser(email, hashedPassword);
            const avatar = await this.assetsService.createAsset(image_1.IMAGE.AVATAR);
            const coverPhoto = await this.assetsService.createAsset(image_1.IMAGE.COVER_PHOTO);
            const profile = await this.profilesService.createProfile(user, avatar, coverPhoto);
            return true;
        }
        catch (E11000) {
            throw new common_1.UnauthorizedException('email already in used');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const newAccessToken = await this.jwtService.signAsync({
                id: payload.id,
                email: payload.email,
            });
            return { access_token: newAccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mailer_service_1.MailerService,
        profiles_service_1.ProfilesService,
        assets_service_1.AssetsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map