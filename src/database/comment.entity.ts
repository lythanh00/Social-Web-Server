import { Post } from 'database/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'database/user.entity';
import { Notification } from './notification.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => Notification, (notification) => notification.comment)
  notification: Notification;
}
