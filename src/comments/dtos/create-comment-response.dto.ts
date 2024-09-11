export class CreatecommentResponseDto {
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
