import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitController } from './controller/git.controller';
import { GitGateway } from './socket/git.gateway';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit/commit.controller';
import { CommitService } from './services/commit/commit.service';

@Module({
  imports: [],
  controllers: [AppController, GitController, CommitController],
  providers: [AppService, GitService, CommitService, GitGateway],
})
export class AppModule {}
