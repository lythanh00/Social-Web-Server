export declare class ReceivedFriendRequestResponseDto {
    id: number;
    sender: {
        userId: number;
        profile: {
            firstName: string;
            lastName: string;
            avatar: {
                url: string;
            };
        };
    };
}
