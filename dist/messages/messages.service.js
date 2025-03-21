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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("../database/message.entity");
const typeorm_2 = require("typeorm");
const chats_service_1 = require("../chats/chats.service");
const users_service_1 = require("../users/users.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const assets_service_1 = require("../assets/assets.service");
let MessagesService = class MessagesService {
    constructor(messageRepository, chatsService, usersService, cloudinary, assetsService) {
        this.messageRepository = messageRepository;
        this.chatsService = chatsService;
        this.usersService = usersService;
        this.cloudinary = cloudinary;
        this.assetsService = assetsService;
    }
    async sendMessage(senderId, sendMessageDto) {
        const { chatId, receiverId, text } = sendMessageDto;
        const chat = await this.chatsService.getChatByChatId(chatId);
        const sender = await this.usersService.getUserById(senderId);
        const receiver = await this.usersService.getUserById(receiverId);
        const message = this.messageRepository.create({
            chat,
            sender,
            receiver,
            text,
        });
        await this.messageRepository.save(message);
        return {
            id: message.id,
            text: message.text,
            image: null,
            senderId: senderId,
            receiverId: receiverId,
            chatId: message.chat.id,
            createdAt: message.createdAt,
            isRead: message.isRead,
        };
    }
    async sendImageMessage(senderId, file, sendMessageDto) {
        const { chatId, receiverId } = sendMessageDto;
        const chat = await this.chatsService.getChatByChatId(chatId);
        const sender = await this.usersService.getUserById(senderId);
        const receiver = await this.usersService.getUserById(receiverId);
        const upload = await this.cloudinary.uploadImage(file).catch(() => {
            throw new common_1.BadRequestException('Invalid file type.');
        });
        const image = await this.assetsService.createAsset(upload.url);
        if (!image) {
            throw new common_1.UnauthorizedException('image not sent');
        }
        const message = this.messageRepository.create({
            chat,
            sender,
            receiver,
            image,
        });
        await this.messageRepository.save(message);
        return {
            id: message.id,
            text: null,
            image: message.image.url,
            senderId: senderId,
            receiverId: receiverId,
            chatId: message.chat.id,
            createdAt: message.createdAt,
            isRead: message.isRead,
        };
    }
    async getMessagesByChat(chatId, cursor) {
        const limit = 20;
        const listMessages = await this.messageRepository.find({
            where: cursor
                ? { chat: { id: chatId }, id: (0, typeorm_2.LessThan)(cursor) }
                : { chat: { id: chatId } },
            relations: ['image', 'sender', 'receiver'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return listMessages.reverse().map((message) => {
            var _a;
            return ({
                id: message.id,
                text: message.text,
                image: message.image ? (_a = message.image) === null || _a === void 0 ? void 0 : _a.url : null,
                senderId: message.sender.id,
                receiverId: message.receiver.id,
                chatId: chatId,
                createdAt: message.createdAt,
                isRead: message.isRead,
            });
        });
    }
    async markAsRead(ownerId, chatId) {
        const listMessages = await this.messageRepository.find({
            where: {
                chat: { id: chatId },
                receiver: { id: ownerId },
                isRead: false,
            },
            order: { createdAt: 'ASC' },
        });
        if (listMessages.length) {
            listMessages.forEach((message) => {
                Object.assign(message, { isRead: true });
            });
            await this.messageRepository.save(listMessages);
            return true;
        }
        return false;
    }
    async countUnreadChats(ownerId) {
        const unreadChats = await this.messageRepository.find({
            where: {
                receiver: { id: ownerId },
                isRead: false,
            },
            relations: ['chat'],
        });
        const uniqueArr = [...new Set(unreadChats.map((item) => item.chat.id))];
        return {
            unreadChatsCount: uniqueArr.length,
            listUnreadChats: uniqueArr,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        chats_service_1.ChatsService,
        users_service_1.UsersService,
        cloudinary_service_1.CloudinaryService,
        assets_service_1.AssetsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map