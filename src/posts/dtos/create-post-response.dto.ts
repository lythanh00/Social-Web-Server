export class CreatePostResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
  };
  images?: {
    id: number;
    url: string;
  }[];
}
