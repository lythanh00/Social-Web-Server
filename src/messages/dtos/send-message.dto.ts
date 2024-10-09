export class SendMessageDto {
  readonly chatId: number;
  readonly receiverId: number;
  readonly text: string;
}
