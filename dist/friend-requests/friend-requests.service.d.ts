import { FriendRequest } from 'database/friend-request.entity';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { FriendRequestResponseDto } from './dtos/friend-request-response.dto';
import { UserFriendsService } from 'user-friends/user-friends.service';
import { RespondToFriendRequestResponseDto } from './dtos/respond-to-friend-request-response.dto';
import { ReceivedFriendRequestResponseDto } from './dtos/received-friend-request-response.dto';
import { NotificationsService } from 'notifications/notifications.service';
export declare class FriendRequestsService {
    private friendRequestRepository;
    private usersService;
    private userFriendsService;
    private notificationsService;
    constructor(friendRequestRepository: Repository<FriendRequest>, usersService: UsersService, userFriendsService: UserFriendsService, notificationsService: NotificationsService);
    createFriendRequest(sender: User, receiver: User): Promise<FriendRequest>;
    findFriendRequestById(id: number): Promise<FriendRequest>;
    sendFriendRequest(senderId: number, receiverId: number): Promise<FriendRequestResponseDto>;
    respondToFriendRequest(requestId: number, accept: boolean): Promise<RespondToFriendRequestResponseDto>;
    isPendingFriendRequest(senderId: number, receiverId: number): Promise<{
        isPending: boolean;
        owner: 'sender' | 'receiver' | null;
    }>;
    removeFriendRequest(senderId: number, receiverId: number): Promise<boolean>;
    getReceivedFriendRequests(userId: number): Promise<ReceivedFriendRequestResponseDto[]>;
}
