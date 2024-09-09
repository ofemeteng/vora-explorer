import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'node:path';
import { join } from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const views = path.join(__dirname, '..', 'views');

  nunjucks.configure(views, {
    autoescape: true,
    express: app,
    watch: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(views);
  app.setViewEngine('njk');

  await app.listen(3000);
}
bootstrap();