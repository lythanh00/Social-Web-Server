import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUserByEmail(email: string): Promise<User>;
    createUser(email: string, password: string): Promise<User>;
    getUserById(id: number): Promise<User>;
}
