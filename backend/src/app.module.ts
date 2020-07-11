import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './services/project/project.service';
import { AuthorService } from './services/author/author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectCommitData, ProjectCommitDataSchema } from './module/commit-data/commit-data';
import { ProjectCommitDataService } from './module/commit-data/commit-data.service';
import { ProjectCommitDataModule } from './module/commit-data/commit-data.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:27017'),
    ProjectCommitDataModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    })],
  controllers: [CommitController, ProjectController],
  providers: [GitService, AuthorService, CommitService, ProjectService],
})
export class AppModule { }
