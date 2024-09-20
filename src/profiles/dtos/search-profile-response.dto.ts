import { Profile } from 'database/profile.entity';

export class SearchProfileResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  avatar: any;
  userId: number;
}
