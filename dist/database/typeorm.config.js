"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfigAsync = void 0;
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./user.entity");
const asset_entity_1 = require("./asset.entity");
const user_friend_entity_1 = require("./user-friend.entity");
const friend_request_entity_1 = require("./friend-request.entity");
const profile_entity_1 = require("./profile.entity");
const post_entity_1 = require("./post.entity");
const post_image_entity_1 = require("./post-image.entity");
const comment_entity_1 = require("./comment.entity");
const like_entity_1 = require("./like.entity");
const chat_entity_1 = require("./chat.entity");
const message_entity_1 = require("./message.entity");
const notification_entity_1 = require("./notification.entity");
exports.typeOrmConfigAsync = {
    imports: [config_1.ConfigModule],
    useFactory: (configService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '070902',
        database: 'social_web',
        entities: [
            user_entity_1.User,
            asset_entity_1.Asset,
            user_friend_entity_1.UserFriend,
            friend_request_entity_1.FriendRequest,
            profile_entity_1.Profile,
            post_entity_1.Post,
            post_image_entity_1.PostImage,
            comment_entity_1.Comment,
            like_entity_1.Like,
            chat_entity_1.Chat,
            message_entity_1.Message,
            notification_entity_1.Notification,
        ],
        synchronize: true,
    }),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=typeorm.config.js.map