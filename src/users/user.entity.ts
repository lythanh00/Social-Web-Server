import { Chat } from 'chats/chat.entity';
import { Comment } from 'comments/comment.entity';
import { FriendRequest } from 'friend-requests/friend_request.entity';
import { Like } from 'likes/like.entity';
import { Message } from 'messages/message.entity';
import { Notification } from 'notifications/notification.entity';
import { Post } from 'posts/post.entity';
import { Profile } from 'profiles/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserFriend } from 'user-friends/user-friend.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  onlineStatus: boolean;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.friend)
  friends: User[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Chat, (chat) => chat.participant1)
  chatsAsParticipant1: Chat[];

  @OneToMany(() => Chat, (chat) => chat.participant2)
  chatsAsParticipant2: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
