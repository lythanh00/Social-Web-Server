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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const chats_service_1 = require("../chats/chats.service");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService, chatsService) {
        this.messagesService = messagesService;
        this.chatsService = chatsService;
        this.logger = new common_1.Logger('MessagesGateway');
        this.clientUserMap = new Map();
    }
    afterInit(server) {
        console.log('Initialized');
    }
    async handleConnection(client) {
        client.connected;
        console.log(`Client connected chat: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected chat: ${client.id}`);
        this.clientUserMap.delete(client.id);
    }
    handleWatchingMessage(client, userId) {
        this.clientUserMap.set(client.id, userId);
        console.log(`Client ${client.id} map userId: ${userId}`);
    }
    handleJoinGroup(client, chatId) {
        client.join(chatId.toString());
        console.log(`Client ${client.id} joined chat: ${chatId}`);
    }
    async handleSendChat(client, payload) {
        var _a;
        const { senderId, chatId, receiverId, text } = payload;
        const message = await this.messagesService.sendMessage(senderId, {
            chatId,
            receiverId,
            text,
        });
        this.server.to(chatId.toString()).emit('newMessage', message);
        const receiverClientId = (_a = Array.from(this.clientUserMap.entries()).find(([, userId]) => userId === receiverId)) === null || _a === void 0 ? void 0 : _a[0];
        const room = await this.server.in(chatId.toString()).fetchSockets();
        if (room &&
            receiverClientId &&
            !room.map((item) => item.id).includes(receiverClientId)) {
            console.log(`Room ${chatId} has not: ${receiverClientId}`);
            const chat = await this.chatsService.getChatWithSocket(chatId);
            const messageNotification = { chat, receiverId };
            this.server
                .to(receiverClientId)
                .emit('message_notification', messageNotification);
        }
    }
    async handleMarkAsRead(client, payload) {
        const { ownerId, chatId } = payload;
        const markAsRead = await this.messagesService.markAsRead(ownerId, chatId);
        this.server.to(chatId.toString()).emit('markAsRead', markAsRead);
    }
    leaveChat(client, chatId) {
        client.leave(chatId.toString());
        console.log(`Client ${client.id} left chat: ${chatId}`);
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('watching_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleWatchingMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleSendChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_chat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "leaveChat", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        chats_service_1.ChatsService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map