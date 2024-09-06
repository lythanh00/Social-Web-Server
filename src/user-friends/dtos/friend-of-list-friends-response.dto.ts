import { Profile } from 'database/profile.entity';

export class FriendOfListFriendsResponseDto {
  id: number;
  friend: {
    id: number;
    profile: Profile;
  };
}
