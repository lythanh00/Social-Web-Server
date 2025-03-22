"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const constants_1 = require("./constants");
exports.CloudinaryProvider = {
    provide: constants_1.CLOUDINARY,
    useFactory: () => {
        try {
            const configResult = cloudinary_1.v2.config({
                cloud_name: process.env.CLD_CLOUD_NAME,
                api_key: process.env.CLD_API_KEY,
                api_secret: process.env.CLD_API_SECRET,
            });
            if (configResult) {
                console.log('Cloudinary connection successfully configured:', configResult.cloud_name);
            }
            else {
                console.error('Cloudinary configuration failed');
            }
            return configResult;
        }
        catch (error) {
            console.error('Error connecting to Cloudinary:', error.message);
        }
    },
};
//# sourceMappingURL=cloudinary.provider.js.map