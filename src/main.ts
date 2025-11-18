import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrapper');

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = process.env.NODE_PORT || '3000';

  await app.listen(port);

  logger.log(`Application running on port ${port}`);
}
bootstrap();
