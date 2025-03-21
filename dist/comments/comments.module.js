"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_entity_1 = require("../database/comment.entity");
const comments_service_1 = require("./comments.service");
const comments_controller_1 = require("./comments.controller");
const posts_module_1 = require("../posts/posts.module");
const users_module_1 = require("../users/users.module");
const comments_gateway_1 = require("./comments.gateway");
const profiles_module_1 = require("../profiles/profiles.module");
const notifications_module_1 = require("../notifications/notifications.module");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment]),
            posts_module_1.PostsModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [comments_service_1.CommentsService, comments_gateway_1.CommentsGateway],
        controllers: [comments_controller_1.CommentsController],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map