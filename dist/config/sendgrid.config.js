"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('sendgrid', () => ({
    apiKey: process.env.SENDGRID_API_KEY || 'SG.test',
}));
//# sourceMappingURL=sendgrid.config.js.map