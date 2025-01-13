export class CreateChatResponseDto {
  id: number;
  participant1: {
    id: number;
    profile: any;
  };
  participant2: {
    id: number;
    profile: any;
  };
}
