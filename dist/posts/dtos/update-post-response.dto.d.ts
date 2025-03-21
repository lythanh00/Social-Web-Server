export declare class UpdatePostResponseDto {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    images?: {
        id: number;
        url: string;
    }[];
}
