import { SendEmailDto } from './dtos/mailer.dto';
import { MailerService } from './mailer.service';
export declare class MailerController {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmailDto(sendEmailDto: SendEmailDto): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
