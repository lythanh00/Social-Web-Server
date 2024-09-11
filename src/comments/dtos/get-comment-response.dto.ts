export class GetCommentResponseDto {
  id: number;
  post: {
    id: number;
  };
  user: {
    id: number;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
