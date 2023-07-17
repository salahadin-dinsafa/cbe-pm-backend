import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter/all-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new AllExceptionFilter);
  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
