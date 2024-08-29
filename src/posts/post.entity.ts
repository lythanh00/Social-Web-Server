import { Comment } from 'comments/comment.entity';
import { Like } from 'likes/like.entity';
import { PostImage } from 'post-images/post-image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  images: PostImage[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
