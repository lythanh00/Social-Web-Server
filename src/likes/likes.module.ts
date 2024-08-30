import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../database/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [],
  controllers: [],
})
export class LikesModule {}
