export declare class GetPostResponseDto {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    images?: {
        id: number;
        url: string;
    }[];
    likes: {
        userId: number;
    }[];
}
