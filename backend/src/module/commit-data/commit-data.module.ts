import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitDataService as CommitDataService } from './commit-data.service';
import { ProjectCommitDataSchema, CommitData } from './commit-data';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommitData.name, schema: ProjectCommitDataSchema }])],
  providers: [CommitDataService],
  exports: [CommitDataService]
})
export class ProjectCommitDataModule {}
