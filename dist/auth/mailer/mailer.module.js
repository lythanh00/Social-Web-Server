"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const jwt_config_1 = require("../../config/jwt.config");
const users_module_1 = require("../../users/users.module");
const mailer_controller_1 = require("./mailer.controller");
const mailer_service_1 = require("./mailer.service");
let MailerModule = class MailerModule {
};
exports.MailerModule = MailerModule;
exports.MailerModule = MailerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            users_module_1.UsersModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule.forFeature(jwt_config_1.default)],
                useFactory: (config) => {
                    return {
                        secret: config.secretKey,
                        signOptions: { expiresIn: config.expiresIn },
                    };
                },
                inject: [jwt_config_1.default.KEY],
            }),
        ],
        providers: [mailer_service_1.MailerService],
        exports: [mailer_service_1.MailerService],
        controllers: [mailer_controller_1.MailerController],
    })
], MailerModule);
//# sourceMappingURL=mailer.module.js.map