export class UserLikePostResponseDto {
  id: number;
  user: {
    id: number;
  };
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: {
      id: number;
      url: string;
    };
  };
}
