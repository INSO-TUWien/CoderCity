import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitGateway } from './socket/git.gateway';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project/project.controller';
import { ProjectService } from './services/project/project.service';
import { AuthorService } from './services/author/author.service';
import { AuthorController } from './controller/author/author.controller';
import { BranchController } from './controller/branch/branch.controller';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development', '.env'],
  })],
  controllers: [AppController, AuthorController, BranchController, CommitController, ProjectController],
  providers: [AppService, GitService, AuthorService, CommitService, ProjectService, GitGateway],
})
export class AppModule {}
