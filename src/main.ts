import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import path from 'node:path';
import { join } from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );

  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>('SESSION_SECRET');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const views = path.join(__dirname, '..', 'views');

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  nunjucks.configure(views, {
    autoescape: true,
    express: app,
    watch: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(views);
  app.setViewEngine('njk');

  const config = new DocumentBuilder()
    .setTitle('Aztrack - Aztec Blockchain Indexer')
    .setDescription('API for Aztec blockchain indexer')
    .setVersion('1.0')
    .addTag('indexer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();