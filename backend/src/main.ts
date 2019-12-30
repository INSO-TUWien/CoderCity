import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GitIndexer } from './git-indexer/git-indexer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
