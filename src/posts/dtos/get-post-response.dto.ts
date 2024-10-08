export class GetPostResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images?: {
    id: number;
    url: string;
  }[];
  likes: {
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
  }[];
}
