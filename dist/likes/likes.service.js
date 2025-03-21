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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("../database/like.entity");
const posts_service_1 = require("../posts/posts.service");
const users_service_1 = require("../users/users.service");
const profiles_service_1 = require("../profiles/profiles.service");
const notifications_service_1 = require("../notifications/notifications.service");
let LikesService = class LikesService {
    constructor(likeRepository, postsService, usersService, profilesService, notificationsService) {
        this.likeRepository = likeRepository;
        this.postsService = postsService;
        this.usersService = usersService;
        this.profilesService = profilesService;
        this.notificationsService = notificationsService;
    }
    async getLikeByOwner(postId, userId) {
        return await this.likeRepository.findOne({
            where: { post: { id: postId }, user: { id: userId }, deletedAt: null },
        });
    }
    async createLike(post, user) {
        const like = this.likeRepository.create({ post, user });
        return this.likeRepository.save(like);
    }
    async removeLike(existingLike) {
        await this.likeRepository.softDelete(existingLike.id);
        return true;
    }
    async getListLikesOfPost(postId, cursor) {
        const limit = 10;
        const post = await this.postsService.getBasePostById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const listLikes = await this.likeRepository.find({
            where: cursor
                ? { post: { id: postId }, id: (0, typeorm_2.LessThan)(cursor) }
                : { post: { id: postId } },
            relations: ['user', 'user.profile', 'user.profile.avatar'],
            order: {
                createdAt: 'DESC',
            },
            take: limit,
        });
        return listLikes.map((like) => ({
            id: like.id,
            user: {
                id: like.user.id,
                profile: {
                    firstName: like.user.profile.firstName,
                    lastName: like.user.profile.lastName,
                    avatar: {
                        url: like.user.profile.avatar.url,
                    },
                },
            },
        }));
    }
    async likePost(ownerId, postId) {
        const post = await this.postsService.getBasePostById(postId);
        const owner = await this.usersService.getUserById(ownerId);
        if (!post || !owner) {
            throw new common_1.NotFoundException('Post or Owner not found');
        }
        const existingLike = await this.likeRepository.findOne({
            where: { post: { id: postId }, user: { id: ownerId } },
            withDeleted: true,
        });
        if (existingLike) {
            if (existingLike.deletedAt) {
                existingLike.deletedAt = null;
                await this.likeRepository.save(existingLike);
                return { message: 'You have successfully liked the post again.' };
            }
            else {
                throw new common_1.BadRequestException('You already liked this post');
            }
        }
        else {
            const like = await this.createLike(post, owner);
            const userId = await this.postsService.getUserIdByPostId(postId);
            if (ownerId !== userId) {
                const notification = await this.notificationsService.createNotification(ownerId, userId, 'like', like.id, null, null);
            }
            return { message: 'You have successfully liked the post.' };
        }
    }
    async unlikePost(userId, postId) {
        const post = await this.postsService.getBasePostById(postId);
        const user = await this.usersService.getUserById(userId);
        if (!post || !user) {
            throw new common_1.NotFoundException('Post or User not found');
        }
        const existingLike = await this.getLikeByOwner(postId, userId);
        if (!existingLike) {
            throw new common_1.BadRequestException('User has not liked this post');
        }
        await this.removeLike(existingLike);
        return { message: 'You have successfully unliked the post.' };
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        posts_service_1.PostsService,
        users_service_1.UsersService,
        profiles_service_1.ProfilesService,
        notifications_service_1.NotificationsService])
], LikesService);
//# sourceMappingURL=likes.service.js.map