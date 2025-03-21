export declare class UserLikePostResponseDto {
    id: number;
    user: {
        id: number;
        profile: {
            firstName: string;
            lastName: string;
            avatar: {
                url: string;
            };
        };
    };
}
