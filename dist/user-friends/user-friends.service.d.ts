import { UserFriend } from 'database/user-friend.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';
import { FriendOfListFriendsResponseDto } from './dtos/friend-of-list-friends-response.dto';
import { ProfilesService } from 'profiles/profiles.service';
import { UsersService } from 'users/users.service';
export declare class UserFriendsService {
    private userFriendRepository;
    private profilesService;
    private usersService;
    constructor(userFriendRepository: Repository<UserFriend>, profilesService: ProfilesService, usersService: UsersService);
    createUserFriend(user: User, friend: User): Promise<UserFriend>;
    getUserFriend(userId: number, friendId: number): Promise<UserFriend>;
    isFriend(userId: number, friendId: number): Promise<boolean>;
    getListFriends(userId: number): Promise<FriendOfListFriendsResponseDto[]>;
    removeFriend(userId: number, friendId: number): Promise<boolean>;
    countFriendsByUser(userId: number): Promise<number>;
}
