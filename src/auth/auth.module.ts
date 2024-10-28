import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { MailerModule } from './mailer/mailer.module';
import { ProfilesModule } from 'profiles/profiles.module';
import { AssetsModule } from 'assets/assets.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120s' },
    }),

    MailerModule,
    ProfilesModule,
    AssetsModule,
  ],
  providers: [
    AuthService,
    // LocalStrategy, JwtStrategy
  ],
  //   exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
