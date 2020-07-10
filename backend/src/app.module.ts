import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './services/project/project.service';
import { AuthorService } from './services/author/author.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development', '.env'],
  })],
  controllers: [AppController, CommitController, ProjectController],
  providers: [GitService, AuthorService, CommitService, ProjectService],
})
export class AppModule {}
