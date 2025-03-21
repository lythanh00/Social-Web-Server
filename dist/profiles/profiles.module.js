"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profile_entity_1 = require("../database/profile.entity");
const profiles_service_1 = require("./profiles.service");
const profiles_controller_1 = require("./profiles.controller");
const user_entity_1 = require("../database/user.entity");
const users_module_1 = require("../users/users.module");
const assets_module_1 = require("../assets/assets.module");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
let ProfilesModule = class ProfilesModule {
};
exports.ProfilesModule = ProfilesModule;
exports.ProfilesModule = ProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([profile_entity_1.Profile, user_entity_1.User]),
            assets_module_1.AssetsModule,
            cloudinary_module_1.CloudinaryModule,
            users_module_1.UsersModule,
        ],
        providers: [profiles_service_1.ProfilesService],
        controllers: [profiles_controller_1.ProfilesController],
        exports: [profiles_service_1.ProfilesService],
    })
], ProfilesModule);
//# sourceMappingURL=profiles.module.js.map