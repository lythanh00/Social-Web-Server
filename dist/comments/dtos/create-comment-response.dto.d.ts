export declare class CreateCommentResponseDto {
    id: number;
    post: {
        id: number;
    };
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
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
