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
exports.FriendRequestsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/guard/auth.guard");
const friend_requests_service_1 = require("./friend-requests.service");
let FriendRequestsController = class FriendRequestsController {
    constructor(friendRequestsService) {
        this.friendRequestsService = friendRequestsService;
    }
    async sendFriendRequest(req, receiverId) {
        return this.friendRequestsService.sendFriendRequest(req.user.id, receiverId);
    }
    async respondToFriendRequest(requestId, accept) {
        return this.friendRequestsService.respondToFriendRequest(requestId, accept);
    }
    async checkIsPendingFriendRequest(req, receiverId) {
        return this.friendRequestsService.isPendingFriendRequest(req.user.id, receiverId);
    }
    async removeFriendRequest(req, receiverId) {
        return this.friendRequestsService.removeFriendRequest(req.user.id, receiverId);
    }
    async getReceivedFriendRequests(req) {
        return this.friendRequestsService.getReceivedFriendRequests(req.user.id);
    }
};
exports.FriendRequestsController = FriendRequestsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FriendRequestsController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('respond/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)('accept')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], FriendRequestsController.prototype, "respondToFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('is-pending-friend-request/:receiverId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FriendRequestsController.prototype, "checkIsPendingFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('remove-friend-request'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FriendRequestsController.prototype, "removeFriendRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-received-friend-requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendRequestsController.prototype, "getReceivedFriendRequests", null);
exports.FriendRequestsController = FriendRequestsController = __decorate([
    (0, common_1.Controller)('friend-requests'),
    __metadata("design:paramtypes", [friend_requests_service_1.FriendRequestsService])
], FriendRequestsController);
//# sourceMappingURL=friend-requests.controller.js.map