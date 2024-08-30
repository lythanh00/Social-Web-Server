import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../database/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [],
  controllers: [],
})
export class ChatsModule {}
