"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixesForLoggers = void 0;
exports.Logger = Logger;
const common_1 = require("@nestjs/common");
exports.prefixesForLoggers = new Array();
function Logger(prefix = '') {
    if (!exports.prefixesForLoggers.includes(prefix)) {
        exports.prefixesForLoggers.push(prefix);
    }
    return (0, common_1.Inject)(`LoggerService${prefix}`);
}
//# sourceMappingURL=logger.decorator.js.map