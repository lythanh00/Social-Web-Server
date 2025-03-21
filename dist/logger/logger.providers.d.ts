import { Provider } from '@nestjs/common';
import { LoggerService } from './logger.service';
export declare function createLoggerProviders(): Array<Provider<LoggerService>>;
