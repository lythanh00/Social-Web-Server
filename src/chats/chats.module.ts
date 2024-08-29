import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [],
  controllers: [],
})
export class ChatsModule {}
