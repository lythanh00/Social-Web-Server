import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable shutdown hooks explicitly.
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  setupSwagger(app);
  //app.useLogger();
  await app.listen(3000);
}
bootstrap();
