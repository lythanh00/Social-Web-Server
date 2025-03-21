import { Asset } from 'database/asset.entity';
import { Post } from 'database/post.entity';
export declare class PostImage {
    id: number;
    post: Post;
    image: Asset;
    createdAt: Date;
    updatedAt: Date;
}
