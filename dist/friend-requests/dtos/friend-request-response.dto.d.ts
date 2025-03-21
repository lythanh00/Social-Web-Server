export declare class FriendRequestResponseDto {
    id: number;
    senderId: number;
    receiverId: number;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
    updatedAt: Date;
}
