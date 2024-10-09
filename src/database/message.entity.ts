import { Asset } from 'database/asset.entity';
import { Chat } from 'database/chat.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'database/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn()
  chat: Chat;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn()
  receiver: User;

  @Column('text', { nullable: true })
  text: string;

  @OneToOne(() => Asset)
  @JoinColumn()
  image: Asset;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
