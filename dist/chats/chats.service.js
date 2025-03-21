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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("../database/chat.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const profiles_service_1 = require("../profiles/profiles.service");
let ChatsService = class ChatsService {
    constructor(chatRepository, usersService, profilesService) {
        this.chatRepository = chatRepository;
        this.usersService = usersService;
        this.profilesService = profilesService;
    }
    async getChatByChatId(id) {
        return this.chatRepository.findOneBy({ id });
    }
    async createChat(participant1Id, participant2Id) {
        const participant1 = await this.usersService.getUserById(participant1Id);
        const participant2 = await this.usersService.getUserById(participant2Id);
        const participant1Profile = await this.profilesService.getProfileByUserId(participant1Id);
        const participant2Profile = await this.profilesService.getProfileByUserId(participant2Id);
        const existingChat = await this.chatRepository.findOne({
            where: [
                {
                    participant1: { id: participant1Id },
                    participant2: { id: participant2Id },
                },
                {
                    participant1: { id: participant2Id },
                    participant2: { id: participant1Id },
                },
            ],
            relations: ['participant1', 'participant2'],
        });
        if (!existingChat) {
            const chat = this.chatRepository.create({
                participant1,
                participant2,
            });
            await this.chatRepository.save(chat);
            return {
                id: chat.id,
                participant1: {
                    id: chat.participant1.id,
                    profile: participant1Profile,
                },
                participant2: {
                    id: chat.participant2.id,
                    profile: participant2Profile,
                },
            };
        }
        return {
            id: existingChat.id,
            participant1: {
                id: existingChat.participant1.id,
                profile: participant1Profile,
            },
            participant2: {
                id: existingChat.participant2.id,
                profile: participant2Profile,
            },
        };
    }
    async getListChatsByUser(ownerId) {
        {
            const listChats = await this.chatRepository.find({
                where: [
                    { participant1: { id: ownerId } },
                    { participant2: { id: ownerId } },
                ],
                relations: [
                    'participant1.profile.avatar',
                    'participant2.profile.avatar',
                    'messages',
                ],
                order: {
                    messages: {
                        createdAt: 'DESC',
                    },
                },
            });
            if (!listChats) {
                throw new common_1.NotFoundException('List chats not found...');
            }
            return listChats.map((chat) => {
                var _a;
                return ({
                    id: chat.id,
                    lastMessage: ((_a = chat.messages[0]) === null || _a === void 0 ? void 0 : _a.text) || null,
                    participant1: {
                        id: chat.participant1.id,
                        profile: {
                            firstName: chat.participant1.profile.firstName,
                            lastName: chat.participant1.profile.lastName,
                            avatar: {
                                url: chat.participant1.profile.avatar.url,
                            },
                        },
                    },
                    participant2: {
                        id: chat.participant2.id,
                        profile: {
                            firstName: chat.participant2.profile.firstName,
                            lastName: chat.participant2.profile.lastName,
                            avatar: {
                                url: chat.participant2.profile.avatar.url,
                            },
                        },
                    },
                });
            });
        }
    }
    async getChatWithSocket(chatId) {
        {
            const chat = await this.chatRepository.findOne({
                where: { id: chatId },
                relations: [
                    'participant1.profile.avatar',
                    'participant2.profile.avatar',
                    'messages',
                ],
            });
            if (!chat) {
                throw new common_1.NotFoundException('Chat not found...');
            }
            const lastMessage = chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].text
                : null;
            return {
                id: chat.id,
                lastMessage,
                participant1: {
                    id: chat.participant1.id,
                    profile: {
                        firstName: chat.participant1.profile.firstName,
                        lastName: chat.participant1.profile.lastName,
                        avatar: {
                            url: chat.participant1.profile.avatar.url,
                        },
                    },
                },
                participant2: {
                    id: chat.participant2.id,
                    profile: {
                        firstName: chat.participant2.profile.firstName,
                        lastName: chat.participant2.profile.lastName,
                        avatar: {
                            url: chat.participant2.profile.avatar.url,
                        },
                    },
                },
            };
        }
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        profiles_service_1.ProfilesService])
], ChatsService);
//# sourceMappingURL=chats.service.js.map