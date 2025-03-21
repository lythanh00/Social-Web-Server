import { LoggerService } from './logger/logger.service';
export declare class AppService {
    private logger;
    constructor(logger: LoggerService);
    getHello(): string;
}
