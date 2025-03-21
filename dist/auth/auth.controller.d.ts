import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    signUp(registerDto: RegisterDto): Promise<boolean>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
