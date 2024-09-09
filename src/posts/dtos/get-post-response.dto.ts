export class GetPostResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updateAt: Date;
  images?: {
    id: number;
    url: string;
  }[];
}
