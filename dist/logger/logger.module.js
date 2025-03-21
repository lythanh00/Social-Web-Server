"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const logger_providers_1 = require("./logger.providers");
const logger_service_1 = require("./logger.service");
class LoggerModule {
    static forRoot() {
        const prefixedLoggerProviders = (0, logger_providers_1.createLoggerProviders)();
        return {
            module: LoggerModule,
            providers: [logger_service_1.LoggerService, ...prefixedLoggerProviders],
            exports: [logger_service_1.LoggerService, ...prefixedLoggerProviders],
        };
    }
}
exports.LoggerModule = LoggerModule;
//# sourceMappingURL=logger.module.js.map