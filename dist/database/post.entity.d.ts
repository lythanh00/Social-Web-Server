import { Comment } from 'database/comment.entity';
import { Like } from 'database/like.entity';
import { PostImage } from 'database/post-image.entity';
import { User } from 'database/user.entity';
export declare class Post {
    id: number;
    user: User;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    images: PostImage[];
    comments: Comment[];
    likes: Like[];
}
