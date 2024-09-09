import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from '../database/post-image.entity';
import { PostImagesService } from './post-images.service';
import { PostImagesController } from './post-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  providers: [PostImagesService],
  controllers: [PostImagesController],
  exports: [PostImagesService],
})
export class PostImagesModule {}
