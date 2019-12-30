import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitController } from './controller/git.controller';
import { GitGateway } from './socket/git.gateway';
import { GitService } from './services/git/git.service';

@Module({
  imports: [],
  controllers: [AppController, GitController],
  providers: [AppService, GitService, GitGateway],
})
export class AppModule {}
