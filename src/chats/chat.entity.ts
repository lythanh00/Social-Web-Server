import { Message } from 'messages/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatsAsParticipant1)
  @JoinColumn()
  participant1: User;

  @ManyToOne(() => User, (user) => user.chatsAsParticipant2)
  @JoinColumn()
  participant2: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
