import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { EMPTY, from, Observable, of } from 'rxjs';
// import { mergeMap, map, throwIfEmpty } from 'rxjs/operators';
import { UsersService } from 'users/users.service';
// import { AccessToken } from './interface/access-token.interface';
// import { JwtPayload } from './interface/jwt-payload.interface';
// import { UserPrincipal } from './interface/user-principal.interface';
import * as bcrypt from 'bcrypt';
import { MailerService } from './mailer/mailer.service';
import { ProfilesService } from 'profiles/profiles.service';
import { AssetsService } from 'assets/assets.service';
import { IMAGE } from 'constant/image';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private profilesService: ProfilesService,
    private assetsService: AssetsService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email is not verifed');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, email: user.email };
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d', // Thời gian sống cho refresh token
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await this.usersService.getUserByEmail(email);
    if (res?.id) {
      throw new UnauthorizedException('username already in used');
    }
    try {
      const user = await this.usersService.createUser(email, hashedPassword);
      const avatar = await this.assetsService.createAsset(IMAGE.AVATAR);
      const coverPhoto = await this.assetsService.createAsset(
        IMAGE.COVER_PHOTO,
      );
      const profile = await this.profilesService.createProfile(
        user,
        avatar,
        coverPhoto,
      );
      const payload = { id: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      await this.mailerService.sendEmail({
        email: email,
        emailType: 'VERIFY',
        userId: user.id,
      });
      return { access_token };
    } catch (E11000) {
      throw new UnauthorizedException('email already in used');
    }
  }

  async checkVerify(token: string) {
    const tokendecore = await this.jwtService.decode(token);
    const userId = tokendecore.id;
    const email = tokendecore.email;
    if (!userId) {
      throw new UnauthorizedException('User not found...');
    }
    if (!tokendecore) {
      throw new UnauthorizedException('Token not match');
    }
    const user = await this.usersService.checkVerify(email);
    return true;
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = await this.jwtService.signAsync({
        id: payload.id,
        email: payload.email,
      });
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
