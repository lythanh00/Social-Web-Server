"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    (0, swagger_1.setupSwagger)(app);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map