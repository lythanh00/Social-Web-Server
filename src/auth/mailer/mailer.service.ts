import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendEmailDto } from './dtos/mailer.dto';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private jwtService: JwtService) {}
  mailTransport() {
    console.log('mail host', process.env.MAIL_HOST);

    const transporter = nodemailer.createTransport({
      host: String(process.env.MAIL_HOST),
      port: Number(process.env.MAIL_PORT),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: String(process.env.MAIL_USERNAME),
        pass: String(process.env.MAIL_PASSWORD),
      },
    });
    return transporter;
  }
  async sendEmailDto(dto: SendEmailDto) {
    const transporter = this.mailTransport();
    const mailOptions = {
      from: 'lucy@gmail.com',
      to: 'jojo@gmail.com',
      subject: 'Verify your email',
      html: '<p><a herf = > Verify your email </a></p>',
    };
    // if (dto.placeholderReplacement) {
    //     Object.keys(dto.placeholderReplacement).forEach((key) => {
    //         mailOptions.html = mailOptions.html.replace(new RegExp(`{{${key}}}`, 'g'), dto.placeholderReplacement[key]);
    //     });
    // }
    try {
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log('Error', error);
    }
  }
  async sendEmail({ email, emailType, userId }: any) {
    try {
      const data = {
        userId: userId,
        expireTime: Date.now() + 3600000,
      };
      const token = this.jwtService.sign({ id: userId, email: email });
      const transporter = this.mailTransport();
      const mailOptions = {
        from: '9eb7433fbd-a65cc1@inbox.mailtrap.io',
        to: email,
        subject:
          emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
        html:
          emailType === 'VERIFY'
            ? `<a href="${process.env.APP_URL}/auth/verifytoken?token=${token}"> here </a>`
            : `<p><a href ="${process.env.APP_URL}/auth/forgotpassword-token?token=${token}"> Reset your password </a></p>`,
      };
      const mailres = await transporter.sendMail(mailOptions);
      console.log(mailres);
      return mailres;
    } catch (error) {
      console.log(error.message);
    }
  }
}
