import { FriendRequestsService } from './friend-requests.service';
export declare class FriendRequestsController {
    private readonly friendRequestsService;
    constructor(friendRequestsService: FriendRequestsService);
    sendFriendRequest(req: any, receiverId: number): Promise<import("./dtos/friend-request-response.dto").FriendRequestResponseDto>;
    respondToFriendRequest(requestId: number, accept: boolean): Promise<import("./dtos/respond-to-friend-request-response.dto").RespondToFriendRequestResponseDto>;
    checkIsPendingFriendRequest(req: any, receiverId: number): Promise<{
        isPending: boolean;
        owner: 'sender' | 'receiver' | null;
    }>;
    removeFriendRequest(req: any, receiverId: number): Promise<boolean>;
    getReceivedFriendRequests(req: any): Promise<import("./dtos/received-friend-request-response.dto").ReceivedFriendRequestResponseDto[]>;
}
