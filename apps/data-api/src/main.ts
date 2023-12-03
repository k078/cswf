/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiResponseInterceptor } from '@cswf/backend/dto';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions = {
    origin: '*', // Of specificeer het specifieke domein van je frontend.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application data-api is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
