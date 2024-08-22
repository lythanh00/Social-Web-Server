import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SendgridModule } from '../sendgrid/sendgrid.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [DatabaseModule, SendgridModule],
  providers: [UserService, ],
  exports: [UserService],
  controllers: [ UserController],
})
export class UserModule {}
