import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectCommitDataService } from './commit-data.service';
import { ProjectCommitDataSchema, ProjectCommitData } from './commit-data';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProjectCommitData.name, schema: ProjectCommitDataSchema }])],
  providers: [ProjectCommitDataService],
  exports: [ProjectCommitDataService]
})
export class ProjectCommitDataModule {}
