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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/guard/auth.guard");
const posts_service_1 = require("./posts.service");
const create_post_dto_1 = require("./dtos/create-post.dto");
const platform_express_1 = require("@nestjs/platform-express");
const update_post_dto_1 = require("./dtos/update-post.dto");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    async createPost(req, createPostDto, files) {
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 1000000) {
                    throw new common_1.BadRequestException('File size exceeds the limit of 1MB.');
                }
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    throw new common_1.BadRequestException('Invalid file type.');
                }
            }
            return this.postsService.createPostWithImages(req.user.id, createPostDto, files);
        }
        return this.postsService.createPostNoImages(req.user.id, createPostDto);
    }
    async getListPostsByOwner(req, cursor) {
        return this.postsService.getListPostsByUser(req.user.id, cursor);
    }
    async getListPostsByUser(userId, cursor) {
        return this.postsService.getListPostsByUser(userId, cursor);
    }
    async getPostByPostId(postId) {
        return this.postsService.getPostByPostId(postId);
    }
    async removeFriend(req, postId) {
        return this.postsService.removePost(req.user.id, postId);
    }
    async updatePost(req, postId, updatePostDto, files) {
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 1000000) {
                    throw new common_1.BadRequestException('File size exceeds the limit of 1MB.');
                }
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    throw new common_1.BadRequestException('Invalid file type.');
                }
            }
            return this.postsService.updatePostWithImages(req.user.id, postId, updatePostDto, files);
        }
        return this.postsService.updatePostNoImages(req.user.id, postId, updatePostDto);
    }
    async getListPostsByOwnerAndFriends(req, cursor) {
        return this.postsService.getListPostsByOwnerAndFriends(req.user.id, cursor);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('create-post'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto, Array]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-posts-by-owner'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getListPostsByOwner", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-posts-by-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getListPostsByUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('get-post/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostByPostId", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('remove-post'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('update-post/:postId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_post_dto_1.UpdatePostDto, Array]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('list-posts-by-owner-and-friends'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getListPostsByOwnerAndFriends", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map