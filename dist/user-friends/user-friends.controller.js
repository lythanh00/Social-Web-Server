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
exports.UserFriendsController = void 0;
const common_1 = require("@nestjs/common");
const user_friends_service_1 = require("./user-friends.service");
const auth_guard_1 = require("../auth/guard/auth.guard");
let UserFriendsController = class UserFriendsController {
    constructor(userFriendsService) {
        this.userFriendsService = userFriendsService;
    }
    async getFriends(req) {
        return this.userFriendsService.getListFriends(req.user.id);
    }
    async removeFriend(req, friendId) {
        return this.userFriendsService.removeFriend(req.user.id, friendId);
    }
    async isFriend(req, friendId) {
        return this.userFriendsService.isFriend(req.user.id, friendId);
    }
    async getFriendsByUser(userId) {
        return this.userFriendsService.getListFriends(userId);
    }
    async countFriendsByOwner(req) {
        return this.userFriendsService.countFriendsByUser(req.user.id);
    }
    async countFriendsByUser(userId) {
        return this.userFriendsService.countFriendsByUser(userId);
    }
};
exports.UserFriendsController = UserFriendsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-friends'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "getFriends", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('remove-friend'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('is-friend/:friendId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "isFriend", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-friends-by-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "getFriendsByUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('count-friends-by-owner'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "countFriendsByOwner", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('count-friends-by-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserFriendsController.prototype, "countFriendsByUser", null);
exports.UserFriendsController = UserFriendsController = __decorate([
    (0, common_1.Controller)('user-friends'),
    __metadata("design:paramtypes", [user_friends_service_1.UserFriendsService])
], UserFriendsController);
//# sourceMappingURL=user-friends.controller.js.map