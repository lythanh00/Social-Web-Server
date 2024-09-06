import { Profile } from 'database/profile.entity';

export class FriendRequestResponseDto {
  id: number;
  sender: {
    id: number;
    email: string;
    profile: Profile;
  };
  receiver: {
    id: number;
    email: string;
    profile: Profile;
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}
