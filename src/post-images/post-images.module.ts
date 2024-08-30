import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from '../database/post-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  providers: [],
  controllers: [],
})
export class PostImagesModule {}
