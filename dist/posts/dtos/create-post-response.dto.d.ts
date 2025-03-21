export declare class CreatePostResponseDto {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        profile: {
            id: number;
            firstName: string;
            lastName: string;
            avatar: {
                id: number;
                url: string;
            };
        };
    };
    images?: {
        id: number;
        url: string;
    }[];
}
