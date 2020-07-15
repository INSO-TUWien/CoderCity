import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectSnapshot } from './project-snapshot';

/**
 * Repository for project commit data.
 * @See https://docs.nestjs.com/techniques/mongodb
 */

@Injectable()
export class ProjectSnapshotService {
    constructor(@InjectModel(ProjectSnapshot.name) private dataModel: Model<ProjectSnapshot>) {}

    async create(createDataModel: { projectId: string, commitId: string, data: string }): Promise<ProjectSnapshot> {
        const created = new this.dataModel(createDataModel);
        return created.save();
    }

    /**
     * Returns all project snapshots regardless of the project from the database 
     */
    async findAll(): Promise<ProjectSnapshot[]> {
        return this.dataModel.find().exec();
    }

    /**
     * Returns whether an entry with the given projectId and commitId exists in the database.
     * @param projectId 
     * @param commitId 
     */
    async exists(projectId: string, commitId: string): Promise<boolean> {
        return this.dataModel.exists({
            'projectId': projectId,
            'commitId': commitId
        });
    }

    async findByCommitId(projectId: string, commitId: string) {
        return this.dataModel.findOne({
            'projectId': projectId,
            'commitId': commitId
        })
    }
}
