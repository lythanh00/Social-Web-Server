import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../database/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [],
  controllers: [],
})
export class ProfilesModule {}
