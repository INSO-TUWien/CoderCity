import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSnapshotService as ProjectSnapshotService } from './project-snapshot.service';
import { ProjectSnapshotDataSchema, ProjectSnapshot } from './project-snapshot';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProjectSnapshot.name, schema: ProjectSnapshotDataSchema }])],
  providers: [ProjectSnapshotService],
  exports: [ProjectSnapshotService]
})
export class ProjectSnapshotDataModule {}
