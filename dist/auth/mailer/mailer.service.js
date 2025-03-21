"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nodemailer = require("nodemailer");
let MailerService = class MailerService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    mailTransport() {
        const transporter = nodemailer.createTransport({
            host: String(process.env.MAIL_HOST),
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: String(process.env.MAIL_USERNAME),
                pass: String(process.env.MAIL_PASSWORD),
            },
        });
        return transporter;
    }
    async sendEmailDto(dto) {
        const transporter = this.mailTransport();
        const mailOptions = {
            from: 'lucy@gmail.com',
            to: 'jojo@gmail.com',
            subject: 'Verify your email',
            html: '<p><a herf = > Verify your email </a></p>',
        };
        try {
            const result = await transporter.sendMail(mailOptions);
            return result;
        }
        catch (error) {
            console.log('Error', error);
        }
    }
    async sendEmail({ email, emailType, userId }) {
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
                subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
                html: emailType === 'VERIFY'
                    ? `<a href="${process.env.APP_URL_CLIENT}/auth/verifytoken?token=${token}"> here </a>`
                    : `<p><a href ="${process.env.APP_URL}/auth/forgotpassword-token?token=${token}"> Reset your password </a></p>`,
            };
            const mailres = await transporter.sendMail(mailOptions);
            return mailres;
        }
        catch (error) {
            console.log(error.message);
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map