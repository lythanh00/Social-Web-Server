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
exports.FriendRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const friend_request_entity_1 = require("../database/friend-request.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const user_friends_service_1 = require("../user-friends/user-friends.service");
const notifications_service_1 = require("../notifications/notifications.service");
let FriendRequestsService = class FriendRequestsService {
    constructor(friendRequestRepository, usersService, userFriendsService, notificationsService) {
        this.friendRequestRepository = friendRequestRepository;
        this.usersService = usersService;
        this.userFriendsService = userFriendsService;
        this.notificationsService = notificationsService;
    }
    async createFriendRequest(sender, receiver) {
        const friendRequest = this.friendRequestRepository.create({
            sender,
            receiver,
        });
        return this.friendRequestRepository.save(friendRequest);
    }
    async findFriendRequestById(id) {
        return this.friendRequestRepository.findOne({
            where: { id },
            relations: ['sender', 'receiver'],
        });
    }
    async sendFriendRequest(senderId, receiverId) {
        if (senderId === receiverId) {
            throw new common_1.BadRequestException('Cannot send friend request to yourself.');
        }
        const sender = await this.usersService.getUserById(senderId);
        const receiver = await this.usersService.getUserById(receiverId);
        if (!sender || !receiver) {
            throw new common_1.NotFoundException('User not found.');
        }
        const existingFriend = await this.userFriendsService.isFriend(senderId, receiverId);
        if (existingFriend) {
            throw new common_1.BadRequestException('Friend already exists in list friends.');
        }
        const existingRequest = await this.friendRequestRepository.findOne({
            where: [
                {
                    sender: { id: senderId },
                    receiver: { id: receiverId },
                    status: 'pending',
                },
                {
                    sender: { id: receiverId },
                    receiver: { id: senderId },
                    status: 'pending',
                },
            ],
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('Friend request already exists.');
        }
        const friendRequest = await this.createFriendRequest(sender, receiver);
        const notification = await this.notificationsService.createNotification(senderId, receiverId, 'friend_request', null, null, friendRequest.id);
        return {
            id: friendRequest.id,
            senderId: sender.id,
            receiverId: receiver.id,
            status: 'pending',
            createdAt: friendRequest.createdAt,
            updatedAt: friendRequest.updatedAt,
        };
    }
    async respondToFriendRequest(requestId, accept) {
        const friendRequest = await this.findFriendRequestById(requestId);
        if (!friendRequest) {
            throw new common_1.NotFoundException('Friend request not found.');
        }
        if (accept) {
            friendRequest.status = 'accepted';
            await this.friendRequestRepository.save(friendRequest);
            const userFriend = await this.userFriendsService.createUserFriend(friendRequest.sender, friendRequest.receiver);
            const userFriend2 = await this.userFriendsService.createUserFriend(friendRequest.receiver, friendRequest.sender);
        }
        else {
            friendRequest.status = 'rejected';
            await this.friendRequestRepository.save(friendRequest);
        }
        return {
            status: friendRequest.status,
        };
    }
    async isPendingFriendRequest(senderId, receiverId) {
        const friendRequest = await this.friendRequestRepository.findOne({
            where: [
                { sender: { id: senderId }, receiver: { id: receiverId } },
                { sender: { id: receiverId }, receiver: { id: senderId } },
            ],
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
        if (friendRequest && friendRequest.status === 'pending') {
            if (friendRequest.sender.id === senderId) {
                return { isPending: true, owner: 'sender' };
            }
            else {
                return { isPending: true, owner: 'receiver' };
            }
        }
        return { isPending: false, owner: null };
    }
    async removeFriendRequest(senderId, receiverId) {
        const friendRequest = await this.friendRequestRepository.findOne({
            where: [
                { sender: { id: senderId }, receiver: { id: receiverId } },
                { sender: { id: receiverId }, receiver: { id: senderId } },
            ],
            order: { createdAt: 'DESC' },
        });
        if (friendRequest && friendRequest.status === 'pending') {
            await this.friendRequestRepository.softDelete(friendRequest.id);
            return true;
        }
        else {
            return false;
        }
    }
    async getReceivedFriendRequests(userId) {
        const receivedFriendRequests = await this.friendRequestRepository.find({
            where: [{ receiver: { id: userId }, status: 'pending' }],
            relations: ['sender', 'sender.profile', 'sender.profile.avatar'],
            order: { createdAt: 'DESC' },
        });
        return receivedFriendRequests.map((receivedFriendRequest) => ({
            id: receivedFriendRequest.id,
            sender: {
                userId: receivedFriendRequest.sender.id,
                profile: {
                    firstName: receivedFriendRequest.sender.profile.firstName,
                    lastName: receivedFriendRequest.sender.profile.lastName,
                    avatar: {
                        url: receivedFriendRequest.sender.profile.avatar.url,
                    },
                },
            },
        }));
    }
};
exports.FriendRequestsService = FriendRequestsService;
exports.FriendRequestsService = FriendRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friend_request_entity_1.FriendRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        user_friends_service_1.UserFriendsService,
        notifications_service_1.NotificationsService])
], FriendRequestsService);
//# sourceMappingURL=friend-requests.service.js.map