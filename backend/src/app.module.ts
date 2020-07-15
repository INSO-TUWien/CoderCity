import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitProjectService } from './services/git/git-project.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import * as Joi from '@hapi/joi';
import { AuthorService } from './services/author/author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSnapshotDataModule } from './module/projectsnapshot/project-snapshot.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:27017'),
    ProjectSnapshotDataModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        GIT_PROJECTS_FOLDER: Joi.string().required(),
        PRE_INDEX_PROJECT_FILES: Joi.boolean().default(false)
      }),
      envFilePath: ['.env.development', '.env'],
    })],
  controllers: [CommitController, ProjectController],
  providers: [GitProjectService, AuthorService, CommitService],
})
export class AppModule { }
