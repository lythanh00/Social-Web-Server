import { Asset } from 'assets/asset.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn() // Xác định userId là khóa ngoại
  user: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @OneToOne(() => Asset)
  @JoinColumn()
  avatar: Asset;

  @OneToOne(() => Asset)
  @JoinColumn()
  coverPhoto: Asset;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true, type: 'text' })
  interests: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
