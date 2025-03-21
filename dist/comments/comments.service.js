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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../database/comment.entity");
const posts_service_1 = require("../posts/posts.service");
const users_service_1 = require("../users/users.service");
const profiles_service_1 = require("../profiles/profiles.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CommentsService = class CommentsService {
    constructor(commentRepository, postsService, usersService, profilesService, notificationsService) {
        this.commentRepository = commentRepository;
        this.postsService = postsService;
        this.usersService = usersService;
        this.profilesService = profilesService;
        this.notificationsService = notificationsService;
    }
    async createComment(post, user, content) {
        const comment = this.commentRepository.create({ post, user, content });
        return this.commentRepository.save(comment);
    }
    async getCommentsByPost(postId, cursor) {
        const limit = 10;
        const post = await this.postsService.getBasePostById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const listComments = await this.commentRepository.find({
            where: cursor
                ? { post: { id: postId }, id: (0, typeorm_2.MoreThan)(cursor) }
                : { post: { id: postId } },
            relations: ['user', 'post', 'user.profile', 'user.profile.avatar'],
            take: limit,
        });
        return listComments.map((comment) => ({
            id: comment.id,
            post: {
                id: comment.post.id,
            },
            user: {
                id: comment.user.id,
                profile: {
                    firstName: comment.user.profile.firstName,
                    lastName: comment.user.profile.lastName,
                    avatar: {
                        url: comment.user.profile.avatar.url,
                    },
                },
            },
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        }));
    }
    async createCommentPost(ownerId, postId, content) {
        const post = await this.postsService.getBasePostById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const owner = await this.usersService.getUserById(ownerId);
        const profile = await this.profilesService.getProfileByUserId(ownerId);
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        const comment = await this.createComment(post, owner, content);
        const userId = await this.postsService.getUserIdByPostId(postId);
        if (ownerId !== userId) {
            const notification = await this.notificationsService.createNotification(ownerId, userId, 'comment', null, comment.id, null);
        }
        return {
            id: comment.id,
            post: {
                id: post.id,
            },
            user: {
                id: owner.id,
                profile: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatar: {
                        url: profile.avatar.url,
                    },
                },
            },
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }
    async updateCommentPost(userId, commentId, content) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId, user: { id: userId } },
            relations: ['user', 'post'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or You are not allowed to edit this comment');
        }
        await Object.assign(comment, { content });
        const updatedComment = await this.commentRepository.save(comment);
        return {
            id: updatedComment.id,
            post: { id: updatedComment.post.id },
            user: { id: updatedComment.user.id },
            content: updatedComment.content,
            createdAt: updatedComment.createdAt,
            updatedAt: updatedComment.updatedAt,
        };
    }
    async removeCommentPost(commentId, userId) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId, user: { id: userId } },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or You are not allowed to delete this comment');
        }
        await this.commentRepository.softDelete(commentId);
        return { message: 'You have successfully delete the comment.' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        posts_service_1.PostsService,
        users_service_1.UsersService,
        profiles_service_1.ProfilesService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map