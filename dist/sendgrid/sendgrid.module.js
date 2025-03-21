"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendgridModule = void 0;
const common_1 = require("@nestjs/common");
const sendgrid_providers_1 = require("./sendgrid.providers");
const sendgrid_service_1 = require("./sendgrid.service");
const config_1 = require("@nestjs/config");
const sendgrid_config_1 = require("../config/sendgrid.config");
let SendgridModule = class SendgridModule {
};
exports.SendgridModule = SendgridModule;
exports.SendgridModule = SendgridModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(sendgrid_config_1.default)],
        providers: [...sendgrid_providers_1.sendgridProviders, sendgrid_service_1.SendgridService],
        exports: [...sendgrid_providers_1.sendgridProviders, sendgrid_service_1.SendgridService]
    })
], SendgridModule);
//# sourceMappingURL=sendgrid.module.js.map