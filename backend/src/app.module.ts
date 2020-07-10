import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './services/project/project.service';
import { AuthorService } from './services/author/author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectCommitData, ProjectCommitDataSchema } from './entities/project-commit-data';
import { Project } from './model/project.model';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: ProjectCommitData.name, schema: ProjectCommitDataSchema}], 'project-commit-data'), 
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    })],
  controllers: [CommitController, ProjectController],
  providers: [GitService, AuthorService, CommitService, ProjectService],
})
export class AppModule { }
