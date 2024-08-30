import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../database/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [],
  controllers: [],
})
export class AssetsModule {}
