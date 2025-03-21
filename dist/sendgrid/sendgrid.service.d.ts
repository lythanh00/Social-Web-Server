import { MailService, MailDataRequired } from '@sendgrid/mail';
import { Observable } from 'rxjs';
export declare class SendgridService {
    private mailService;
    constructor(mailService: MailService);
    send(data: MailDataRequired): Observable<any>;
}
