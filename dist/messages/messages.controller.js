"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const send_message_dto_1 = require("./dtos/send-message.dto");
const auth_guard_1 = require("../auth/guard/auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async sendMessage(req, sendMessageDto) {
        return await this.messagesService.sendMessage(req.user.id, sendMessageDto);
    }
    async sendImageMessage(file, req, sendMessageDto) {
        return await this.messagesService.sendImageMessage(req.user.id, file, sendMessageDto);
    }
    async getMessagesByChat(req, chatId, cursor) {
        return await this.messagesService.getMessagesByChat(chatId, cursor);
    }
    async markMessageAsRead(req, chatId) {
        await this.messagesService.markAsRead(req.user.id, chatId);
        return true;
    }
    async countUnreadChats(req) {
        return await this.messagesService.countUnreadChats(req.user.id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('send-message'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('send-image-message'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image-message')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 1000000 }),
            new common_1.FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
    }))),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendImageMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-messages-by-chat/:chatId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessagesByChat", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('mark-message-as-read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('count-unread-chats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "countUnreadChats", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map