import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../database/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [],
  controllers: [],
})
export class MessagesModule {}
