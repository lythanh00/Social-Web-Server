import { Asset } from 'assets/asset.entity';
import { Post } from 'posts/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.images)
  @JoinColumn()
  post: Post;

  @OneToOne(() => Asset)
  @JoinColumn() // Đặt tên cột khóa ngoại trong bảng post_images
  image: Asset;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
