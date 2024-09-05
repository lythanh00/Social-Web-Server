import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../database/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async findAssetById(id: number): Promise<Asset> {
    return this.assetRepository.findOneBy({ id });
  }

  async createAsset(url: string): Promise<Asset> {
    const asset = this.assetRepository.create({ url });
    return this.assetRepository.save(asset);
  }
}
