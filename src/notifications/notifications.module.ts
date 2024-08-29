import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [],
  controllers: [],
})
export class NotificationsModule {}
