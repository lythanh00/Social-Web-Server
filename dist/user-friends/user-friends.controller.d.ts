import { UserFriendsService } from './user-friends.service';
export declare class UserFriendsController {
    private readonly userFriendsService;
    constructor(userFriendsService: UserFriendsService);
    getFriends(req: any): Promise<import("./dtos/friend-of-list-friends-response.dto").FriendOfListFriendsResponseDto[]>;
    removeFriend(req: any, friendId: number): Promise<boolean>;
    isFriend(req: any, friendId: number): Promise<boolean>;
    getFriendsByUser(userId: number): Promise<import("./dtos/friend-of-list-friends-response.dto").FriendOfListFriendsResponseDto[]>;
    countFriendsByOwner(req: any): Promise<number>;
    countFriendsByUser(userId: number): Promise<number>;
}
