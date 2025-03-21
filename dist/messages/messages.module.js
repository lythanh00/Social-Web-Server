"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("../database/message.entity");
const messages_controller_1 = require("./messages.controller");
const messages_service_1 = require("./messages.service");
const chats_module_1 = require("../chats/chats.module");
const users_module_1 = require("../users/users.module");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const assets_module_1 = require("../assets/assets.module");
const messages_gateway_1 = require("./messages.gateway");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message]),
            chats_module_1.ChatsModule,
            users_module_1.UsersModule,
            cloudinary_module_1.CloudinaryModule,
            assets_module_1.AssetsModule,
        ],
        providers: [messages_service_1.MessagesService, messages_gateway_1.MessagesGateway],
        controllers: [messages_controller_1.MessagesController],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map