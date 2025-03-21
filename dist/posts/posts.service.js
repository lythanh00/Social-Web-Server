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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../database/post.entity");
const assets_service_1 = require("../assets/assets.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const users_service_1 = require("../users/users.service");
const post_images_service_1 = require("../post-images/post-images.service");
const user_friends_service_1 = require("../user-friends/user-friends.service");
const profiles_service_1 = require("../profiles/profiles.service");
let PostsService = class PostsService {
    constructor(postRepository, assetsService, cloudinary, postImagesService, usersService, profilesService, userFriendsService) {
        this.postRepository = postRepository;
        this.assetsService = assetsService;
        this.cloudinary = cloudinary;
        this.postImagesService = postImagesService;
        this.usersService = usersService;
        this.profilesService = profilesService;
        this.userFriendsService = userFriendsService;
    }
    async getBasePostById(id) {
        const post = await this.postRepository.findOneBy({
            id,
        });
        if (!post) {
            throw new common_1.UnauthorizedException('Post not found...');
        }
        return post;
    }
    async getPostByPostId(postId) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: [
                'images',
                'images.image',
                'user',
                'user.profile',
                'user.profile.avatar',
                'likes',
                'likes.user',
            ],
        });
        if (!post) {
            throw new common_1.UnauthorizedException('Post not found...');
        }
        const postWithImages = await this.postImagesService.getListPostImages(post.id);
        return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updateAt: post.updatedAt,
            images: postWithImages.map((image) => ({
                id: image.id,
                url: image.image.url,
            })),
            user: {
                id: post.user.id,
                profile: {
                    id: post.user.profile.id,
                    firstName: post.user.profile.firstName,
                    lastName: post.user.profile.lastName,
                    avatar: {
                        id: post.user.profile.avatar.id,
                        url: post.user.profile.avatar.url,
                    },
                },
            },
            likes: post.likes.map((like) => ({
                userId: like.user.id,
            })),
        };
    }
    async createPost(user, content) {
        const post = await this.postRepository.create({ user, content });
        return this.postRepository.save(post);
    }
    async updatePost(userId, postId, content) {
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
        });
        if (!post) {
            throw new common_1.UnauthorizedException('Post not found or you do not have permission to update this post.');
        }
        if (content) {
            await Object.assign(post, { content });
            return this.postRepository.save(post);
        }
        return post;
    }
    async createPostWithImages(userId, createPostDto, files) {
        const content = createPostDto.content;
        const user = await this.usersService.getUserById(userId);
        const profile = await this.profilesService.getProfileByUserId(userId);
        const post = await this.createPost(user, content);
        const images = [];
        for (const file of files) {
            const upload = await this.cloudinary.uploadImage(file).catch(() => {
                throw new common_1.BadRequestException('Invalid file type.');
            });
            const image = await this.assetsService.createAsset(upload.url);
            if (!image) {
                throw new common_1.UnauthorizedException('Image not created');
            }
            const postImage = await this.postImagesService.createPostImage(post, image);
            images.push(postImage.image);
        }
        return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: {
                id: user.id,
                profile: {
                    id: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatar: {
                        id: profile.avatar.id,
                        url: profile.avatar.url,
                    },
                },
            },
            images: images.map((image) => ({
                id: image.id,
                url: image.url,
            })),
        };
    }
    async createPostNoImages(userId, createPostDto) {
        const content = createPostDto.content;
        const user = await this.usersService.getUserById(userId);
        const profile = await this.profilesService.getProfileByUserId(userId);
        const post = await this.createPost(user, content);
        return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: {
                id: user.id,
                profile: {
                    id: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatar: {
                        id: profile.avatar.id,
                        url: profile.avatar.url,
                    },
                },
            },
        };
    }
    async getListPostsByUser(userId, cursor) {
        {
            const limit = 10;
            const listPosts = await this.postRepository.find({
                where: cursor
                    ? { user: { id: userId }, id: (0, typeorm_2.LessThan)(cursor) }
                    : { user: { id: userId } },
                relations: ['images', 'images.image', 'likes', 'likes.user'],
                order: {
                    updatedAt: 'DESC',
                },
                take: limit,
            });
            if (!listPosts) {
                throw new common_1.UnauthorizedException('List posts not found...');
            }
            return listPosts.map((post) => ({
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                images: post.images.map((image) => ({
                    id: image.image.id,
                    url: image.image.url,
                })),
                likes: post.likes.map((like) => ({
                    userId: like.user.id,
                })),
            }));
        }
    }
    async removePost(userId, postId) {
        const post = await this.postRepository.findOne({
            where: { id: postId, user: { id: userId } },
        });
        if (!post) {
            throw new common_1.UnauthorizedException('Post not found or you do not have permission to delete this post.');
        }
        await this.postRepository.softDelete(post.id);
        return true;
    }
    async updatePostWithImages(userId, postId, updatePostDto, files) {
        const content = updatePostDto.content;
        const post = await this.updatePost(userId, postId, content);
        const postWithImages = await this.postImagesService.getListPostImages(postId);
        const images = postWithImages.map((postImage) => postImage.image);
        for (const file of files) {
            const upload = await this.cloudinary.uploadImage(file).catch(() => {
                throw new common_1.BadRequestException('Invalid file type.');
            });
            const image = await this.assetsService.createAsset(upload.url);
            if (!image) {
                throw new common_1.UnauthorizedException('Image not created');
            }
            const postImage = await this.postImagesService.createPostImage(post, image);
            images.push(postImage.image);
        }
        return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            images: images.map((image) => ({
                id: image.id,
                url: image.url,
            })),
        };
    }
    async updatePostNoImages(userId, postId, updatePostDto) {
        const content = updatePostDto.content;
        const post = await this.updatePost(userId, postId, content);
        const postWithImages = await this.postImagesService.getListPostImages(postId);
        return {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            images: postWithImages.map((image) => ({
                id: image.id,
                url: image.image.url,
            })),
        };
    }
    async getListPostsByOwnerAndFriends(ownerId, cursor) {
        const limit = 10;
        const userFriends = await this.userFriendsService.getListFriends(ownerId);
        const userFriendIds = userFriends.map((userFriend) => {
            return userFriend.friend.id;
        });
        const ownerIdAndUserFriendIds = [ownerId, ...userFriendIds];
        const listPosts = await this.postRepository.find({
            where: cursor
                ? { user: (0, typeorm_2.In)(ownerIdAndUserFriendIds), id: (0, typeorm_2.LessThan)(cursor) }
                : { user: (0, typeorm_2.In)(ownerIdAndUserFriendIds) },
            relations: [
                'images',
                'images.image',
                'user',
                'user.profile',
                'user.profile.avatar',
                'likes',
                'likes.user',
            ],
            order: {
                updatedAt: 'DESC',
            },
            take: limit,
        });
        if (!listPosts) {
            throw new common_1.UnauthorizedException('List posts not found...');
        }
        return listPosts.map((post) => ({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            images: post.images.map((image) => ({
                id: image.image.id,
                url: image.image.url,
            })),
            user: {
                id: post.user.id,
                profile: {
                    id: post.user.profile.id,
                    firstName: post.user.profile.firstName,
                    lastName: post.user.profile.lastName,
                    avatar: {
                        id: post.user.profile.avatar.id,
                        url: post.user.profile.avatar.url,
                    },
                },
            },
            likes: post.likes.map((like) => ({
                userId: like.user.id,
            })),
        }));
    }
    async getUserIdByPostId(postId) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });
        return post.user.id;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        assets_service_1.AssetsService,
        cloudinary_service_1.CloudinaryService,
        post_images_service_1.PostImagesService,
        users_service_1.UsersService,
        profiles_service_1.ProfilesService,
        user_friends_service_1.UserFriendsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map