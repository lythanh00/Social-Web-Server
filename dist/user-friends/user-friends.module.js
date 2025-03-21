"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriendsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_friend_entity_1 = require("../database/user-friend.entity");
const user_friends_service_1 = require("./user-friends.service");
const user_friends_controller_1 = require("./user-friends.controller");
const profiles_module_1 = require("../profiles/profiles.module");
const users_module_1 = require("../users/users.module");
let UserFriendsModule = class UserFriendsModule {
};
exports.UserFriendsModule = UserFriendsModule;
exports.UserFriendsModule = UserFriendsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_friend_entity_1.UserFriend]),
            profiles_module_1.ProfilesModule,
            users_module_1.UsersModule,
        ],
        providers: [user_friends_service_1.UserFriendsService],
        controllers: [user_friends_controller_1.UserFriendsController],
        exports: [user_friends_service_1.UserFriendsService],
    })
], UserFriendsModule);
//# sourceMappingURL=user-friends.module.js.map