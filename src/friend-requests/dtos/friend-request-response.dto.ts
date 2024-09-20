export class FriendRequestResponseDto {
  id: number;
  sender: {
    id: number;
    email: string;
    profile: any;
  };
  receiver: {
    id: number;
    email: string;
    profile: any;
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}
