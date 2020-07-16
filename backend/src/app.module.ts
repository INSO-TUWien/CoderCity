import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GitProjectService } from './services/git/git-project.service';
import { CommitController } from './controller/commit.controller';
import { CommitService } from './services/commit/commit.service';
import { ProjectController } from './controller/project.controller';
import * as Joi from '@hapi/joi';
import { AuthorService } from './services/author/author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSnapshotDataModule } from './module/projectsnapshot/project-snapshot.module';
import { async } from 'rxjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        GIT_PROJECTS_FOLDER: Joi.string().required(),
        INDEX_MODE: Joi.string().default('LAZY').valid('LAZY', 'EAGER'),
      }),
      envFilePath: ['.env.development', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService]
    }),
    ProjectSnapshotDataModule,
    
  ],
  controllers: [CommitController, ProjectController],
  providers: [GitProjectService, AuthorService, CommitService],
})
export class AppModule { }
