import { JwtService } from '@nestjs/jwt';
import { SendEmailDto } from './dtos/mailer.dto';
import * as nodemailer from 'nodemailer';
export declare class MailerService {
    private jwtService;
    constructor(jwtService: JwtService);
    mailTransport(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendEmailDto(dto: SendEmailDto): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendEmail({ email, emailType, userId }: any): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
