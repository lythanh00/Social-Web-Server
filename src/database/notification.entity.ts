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
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentNotifications)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
  @JoinColumn()
  receiver: User;

  @Column({
    type: 'enum',
    enum: ['friend_request', 'comment', 'like', 'message'],
  })
  type: 'friend_request' | 'comment' | 'like' | 'message';

  @OneToOne(() => Like, (like) => like.notification, { nullable: true })
  @JoinColumn()
  like: Like;

  @OneToOne(() => Comment, (comment) => comment.notification, {
    nullable: true,
  })
  @JoinColumn()
  comment: Comment;

  @OneToOne(
    () => FriendRequest,
    (friendRequest) => friendRequest.notification,
    { nullable: true },
  )
  @JoinColumn()
  friendRequest: FriendRequest;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
