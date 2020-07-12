import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitService } from './services/git/git.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './services/project/project.service';
import { AuthorService } from './services/author/author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSnapshotDataModule } from './module/projectsnapshot/project-snapshot.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:27017'),
    ProjectSnapshotDataModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    })],
  controllers: [CommitController, ProjectController],
  providers: [GitService, AuthorService, CommitService, ProjectService],
})
export class AppModule { }
