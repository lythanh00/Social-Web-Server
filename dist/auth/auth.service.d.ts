import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';
import { MailerService } from './mailer/mailer.service';
import { ProfilesService } from 'profiles/profiles.service';
import { AssetsService } from 'assets/assets.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailerService;
    private profilesService;
    private assetsService;
    constructor(usersService: UsersService, jwtService: JwtService, mailerService: MailerService, profilesService: ProfilesService, assetsService: AssetsService);
    login(email: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(email: string, password: string): Promise<boolean>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
