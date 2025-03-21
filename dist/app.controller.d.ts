import { AppService } from './app.service';
export declare class AppController {
    private service;
    constructor(service: AppService);
    getHello(): string;
}
