import { Repository } from 'typeorm';
import { PostImage } from '../database/post-image.entity';
import { Asset } from 'database/asset.entity';
import { Post } from 'database/post.entity';
export declare class PostImagesService {
    private postImagesRepository;
    constructor(postImagesRepository: Repository<PostImage>);
    createPostImage(post: Post, image: Asset): Promise<PostImage>;
    getListPostImages(postId: number): Promise<PostImage[]>;
}
