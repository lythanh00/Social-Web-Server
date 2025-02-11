import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  // async checkVerify(email: string): Promise<User> {
  //   await this.userRepository.update({ email: email }, { isVerified: true });

  //   const user = await this.userRepository.findOneBy({ email: email });

  //   return user;
  // }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
