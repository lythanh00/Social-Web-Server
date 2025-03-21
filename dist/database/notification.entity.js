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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const like_entity_1 = require("./like.entity");
const comment_entity_1 = require("./comment.entity");
const friend_request_entity_1 = require("./friend-request.entity");
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sentNotifications),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.receivedNotifications),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['friend_request', 'comment', 'like', 'message'],
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => like_entity_1.Like, (like) => like.notification, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", like_entity_1.Like)
], Notification.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => comment_entity_1.Comment, (comment) => comment.notification, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", comment_entity_1.Comment)
], Notification.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => friend_request_entity_1.FriendRequest, (friendRequest) => friendRequest.notification, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", friend_request_entity_1.FriendRequest)
], Notification.prototype, "friendRequest", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "deletedAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
//# sourceMappingURL=notification.entity.js.map