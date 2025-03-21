import { Repository } from 'typeorm';
import { Asset } from '../database/asset.entity';
export declare class AssetsService {
    private assetRepository;
    constructor(assetRepository: Repository<Asset>);
    findAssetById(id: number): Promise<Asset>;
    createAsset(url: string): Promise<Asset>;
}
