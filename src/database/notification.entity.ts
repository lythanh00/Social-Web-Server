import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'database/user.entity';

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

  @Column()
  dataId: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
