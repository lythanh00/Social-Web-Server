import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { MailTokenDto } from './dtos/mail-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('/register')
  signUp(@Body() registerDto: RegisterDto): Promise<{ access_token: string }> {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('/verify-token')
  async verifyToken(@Body() mailToken: MailTokenDto) {
    return this.authService.checkVerify(mailToken.token);
  }

  @Post('/refresh-token')
  refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ access_token: string }> {
    return this.authService.refreshToken(refreshToken);
  }
}
