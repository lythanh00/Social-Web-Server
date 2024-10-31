export class SendMessageResponseDto {
  id: number;
  text: string;
  image: string;
  senderId: number;
  receiverId: number;
  createdAt: Date;
  isRead: boolean;
}
