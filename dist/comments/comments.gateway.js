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
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const comments_service_1 = require("./comments.service");
const common_1 = require("@nestjs/common");
let CommentsGateway = class CommentsGateway {
    constructor(commentsService) {
        this.commentsService = commentsService;
        this.logger = new common_1.Logger('CommentsGateway');
    }
    afterInit(server) {
        console.log('Initialized');
    }
    async handleConnection(client) {
        client.connected;
        console.log(`Client connected comment: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected comment: ${client.id}`);
    }
    handleJoinGroup(client, postId) {
        client.join(postId.toString());
        console.log(`Client ${client.id} joined comment post: ${postId}`);
    }
    async handleSendComment(client, payload) {
        const { userId, postId, content } = payload;
        const comment = await this.commentsService.createCommentPost(userId, postId, content);
        this.server.to(postId.toString()).emit('newComment', comment);
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_comment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleJoinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendComment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], CommentsGateway.prototype, "handleSendComment", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map