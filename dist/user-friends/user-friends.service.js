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
exports.UserFriendsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_friend_entity_1 = require("../database/user-friend.entity");
const typeorm_2 = require("typeorm");
const profiles_service_1 = require("../profiles/profiles.service");
const users_service_1 = require("../users/users.service");
let UserFriendsService = class UserFriendsService {
    constructor(userFriendRepository, profilesService, usersService) {
        this.userFriendRepository = userFriendRepository;
        this.profilesService = profilesService;
        this.usersService = usersService;
    }
    async createUserFriend(user, friend) {
        const userFriend = this.userFriendRepository.create({ user, friend });
        return this.userFriendRepository.save(userFriend);
    }
    async getUserFriend(userId, friendId) {
        const userFriend = await this.userFriendRepository.findOne({
            where: { user: { id: userId }, friend: { id: friendId } },
            relations: ['user', 'friend'],
        });
        return userFriend;
    }
    async isFriend(userId, friendId) {
        const userFriend = await this.userFriendRepository.findOne({
            where: [
                { user: { id: userId }, friend: { id: friendId } },
                { user: { id: friendId }, friend: { id: userId } },
            ],
        });
        if (userFriend) {
            return true;
        }
        else {
            return false;
        }
    }
    async getListFriends(userId) {
        const userFriends = await this.userFriendRepository.find({
            where: [{ user: { id: userId } }],
            relations: ['friend', 'friend.profile', 'friend.profile.avatar'],
        });
        return userFriends.map((userFriend) => ({
            id: userFriend.id,
            friend: {
                id: userFriend.friend.id,
                profile: userFriend.friend.profile,
            },
        }));
    }
    async removeFriend(userId, friendId) {
        const userFriend = await this.getUserFriend(userId, friendId);
        await this.userFriendRepository.softDelete(userFriend.id);
        const userFriend2 = await this.getUserFriend(friendId, userId);
        await this.userFriendRepository.softDelete(userFriend2.id);
        return true;
    }
    async countFriendsByUser(userId) {
        return await this.userFriendRepository.count({
            where: [{ user: { id: userId } }],
        });
    }
};
exports.UserFriendsService = UserFriendsService;
exports.UserFriendsService = UserFriendsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_friend_entity_1.UserFriend)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        profiles_service_1.ProfilesService,
        users_service_1.UsersService])
], UserFriendsService);
//# sourceMappingURL=user-friends.service.js.map