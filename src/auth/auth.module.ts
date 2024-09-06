import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { MailerModule } from './mailer/mailer.module';
import { ProfilesModule } from 'profiles/profiles.module';
import { AssetsModule } from 'assets/assets.module';
import { FriendRequestsModule } from 'friend-requests/friend-requests.module';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './strategy/local.strategy';
// import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
// import { JwtStrategy } from './strategy/jwt.strategy';
// import { ConfigModule, ConfigType } from '@nestjs/config';
// import jwtConfig from '../config/jwt.config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1y' },
    }),
    MailerModule,
    ProfilesModule,
    AssetsModule,
    FriendRequestsModule,
  ],
  providers: [
    AuthService,
    // LocalStrategy, JwtStrategy
  ],
  //   exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
