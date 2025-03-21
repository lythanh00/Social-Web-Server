"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggerProviders = createLoggerProviders;
const logger_decorator_1 = require("./logger.decorator");
const logger_service_1 = require("./logger.service");
function loggerFactory(logger, prefix) {
    if (prefix) {
        logger.setPrefix(prefix);
    }
    return logger;
}
function createLoggerProvider(prefix) {
    return {
        provide: `LoggerService${prefix}`,
        useFactory: logger => loggerFactory(logger, prefix),
        inject: [logger_service_1.LoggerService],
    };
}
function createLoggerProviders() {
    return logger_decorator_1.prefixesForLoggers.map(prefix => createLoggerProvider(prefix));
}
//# sourceMappingURL=logger.providers.js.map