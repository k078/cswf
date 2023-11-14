/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiResponseInterceptor } from '@cswf/backend/dto';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions = {
    origin: 'https://mango-river-03c376a03.4.azurestaticapps.net/', // Of specificeer het specifieke domein van je frontend.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);


  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application data-api is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
