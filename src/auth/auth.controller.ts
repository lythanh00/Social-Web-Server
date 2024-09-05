import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';
import { RegisterDto } from './dtos/register.dto';
import { MailTokenDto } from './dtos/mailToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
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
}
