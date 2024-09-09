export class CreatePostResponseDto {
  id: number;
  user: {
    id: number;
  };
  content: string;
  createdAt: Date;
  images?: {
    id: number;
    url: string;
  }[];
}
