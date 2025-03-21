import { Asset } from 'database/asset.entity';
import { User } from 'database/user.entity';
export declare class Profile {
    id: number;
    user: User;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    avatar: Asset;
    coverPhoto: Asset;
    bio: string;
    location: string;
    interests: string;
    createdAt: Date;
    updatedAt: Date;
}
