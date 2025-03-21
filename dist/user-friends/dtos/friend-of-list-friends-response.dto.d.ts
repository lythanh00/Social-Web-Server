import { Profile } from 'database/profile.entity';
export declare class FriendOfListFriendsResponseDto {
    id: number;
    friend: {
        id: number;
        profile: Profile;
    };
}
