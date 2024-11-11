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
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn()
  receiver: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => Notification, (notification) => notification.friendRequest)
  notification: Notification;
}
