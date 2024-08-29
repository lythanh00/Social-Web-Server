import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'users/user.entity';

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
}
