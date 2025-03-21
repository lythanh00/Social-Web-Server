"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostImagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const post_image_entity_1 = require("../database/post-image.entity");
const post_images_service_1 = require("./post-images.service");
const post_images_controller_1 = require("./post-images.controller");
let PostImagesModule = class PostImagesModule {
};
exports.PostImagesModule = PostImagesModule;
exports.PostImagesModule = PostImagesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([post_image_entity_1.PostImage])],
        providers: [post_images_service_1.PostImagesService],
        controllers: [post_images_controller_1.PostImagesController],
        exports: [post_images_service_1.PostImagesService],
    })
], PostImagesModule);
//# sourceMappingURL=post-images.module.js.map