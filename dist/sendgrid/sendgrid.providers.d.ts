import { ConfigType } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import sendgridConfig from '../config/sendgrid.config';
export declare const sendgridProviders: {
    provide: string;
    useFactory: (config: ConfigType<typeof sendgridConfig>) => MailService;
    inject: string[];
}[];
