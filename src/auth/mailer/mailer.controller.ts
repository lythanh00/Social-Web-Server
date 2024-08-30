import { Controller, Post } from '@nestjs/common';
import { SendEmailDto } from './dtos/mailer.dto';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}
  @Post('/send-emailDto')
  async sendEmailDto(sendEmailDto: SendEmailDto) {
    return await this.mailerService.sendEmailDto(sendEmailDto);
  }
}
