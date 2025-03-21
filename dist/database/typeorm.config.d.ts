import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
export declare const typeOrmConfigAsync: {
    imports: (typeof ConfigModule)[];
    useFactory: (configService: ConfigService) => TypeOrmModuleOptions;
    inject: (typeof ConfigService)[];
};
