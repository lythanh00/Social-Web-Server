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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
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

    const payload = { sub: user.id, email: user.email };
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await this.usersService.findByEmail(email);
    if (res?.id) {
      throw new UnauthorizedException('username already in used');
    }
    try {
      const user = await this.usersService.createUser(email, hashedPassword);
      const payload = { sub: user.id, email: user.email };
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
}
