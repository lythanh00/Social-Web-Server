"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendgridProviders = void 0;
const mail_1 = require("@sendgrid/mail");
const sendgrid_config_1 = require("../config/sendgrid.config");
const sendgrid_constants_1 = require("./sendgrid.constants");
exports.sendgridProviders = [
    {
        provide: sendgrid_constants_1.SENDGRID_MAIL,
        useFactory: (config) => {
            const mail = new mail_1.MailService();
            mail.setApiKey(config.apiKey);
            mail.setTimeout(5000);
            return mail;
        },
        inject: [sendgrid_config_1.default.KEY],
    }
];
//# sourceMappingURL=sendgrid.providers.js.map