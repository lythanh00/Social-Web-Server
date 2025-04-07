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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("../database/notification.entity");
const typeorm_2 = require("typeorm");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async createNotification(senderId, receiverId, type, likeId, commentId, friendRequestId) {
        const notification = this.notificationRepository.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            type,
            like: { id: likeId },
            comment: { id: commentId },
            friendRequest: { id: friendRequestId },
        });
        await this.notificationRepository.save(notification);
        return notification;
    }
    async getListNotificationsByUser(ownerId) {
        {
            const limit = 30;
            const listNotifications = await this.notificationRepository.find({
                where: { receiver: { id: ownerId } },
                relations: [
                    'sender',
                    'sender.profile',
                    'sender.profile.avatar',
                    'like',
                    'like.post',
                    'comment',
                    'comment.post',
                    'friendRequest',
                ],
                order: {
                    createdAt: 'DESC',
                },
                take: limit,
            });
            if (!listNotifications) {
                throw new common_1.NotFoundException('List notifications not found...');
            }
            return listNotifications.map((notification) => {
                var _a, _b, _c;
                return ({
                    id: notification.id,
                    type: notification.type,
                    likedPostId: (_a = notification.like) === null || _a === void 0 ? void 0 : _a.post.id,
                    commentedPostId: (_b = notification.comment) === null || _b === void 0 ? void 0 : _b.post.id,
                    friendRequestId: (_c = notification.friendRequest) === null || _c === void 0 ? void 0 : _c.id,
                    isRead: notification.isRead,
                    createdAt: notification.createdAt,
                    sender: {
                        firstName: notification.sender.profile.firstName,
                        lastName: notification.sender.profile.lastName,
                        avatar: notification.sender.profile.avatar.url,
                    },
                });
            });
        }
    }
    async markNotificationAsRead(ownerId, notificationId) {
        const notification = await this.notificationRepository.findOneBy({
            id: notificationId,
            receiver: { id: ownerId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        await Object.assign(notification, { isRead: true });
        await this.notificationRepository.save(notification);
    }
    async countUnreadNotifications(ownerId) {
        const limit = 30;
        const notifications = await this.notificationRepository.find({
            where: {
                receiver: { id: ownerId },
            },
            order: {
                createdAt: 'DESC',
            },
            take: limit,
        });
        const unreadNotificationsCount = notifications.filter((notification) => !notification.isRead).length;
        return unreadNotificationsCount;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map