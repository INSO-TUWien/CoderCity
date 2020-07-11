import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectCommitData } from './commit-data';

/**
 * Repository for project commit data.
 * @See https://docs.nestjs.com/techniques/mongodb
 */

@Injectable()
export class ProjectCommitDataService {
    constructor(@InjectModel(ProjectCommitData.name) private dataModel: Model<ProjectCommitData>) {}

    async create(createDataModel: { projectId: string, commitId: string, data: string }): Promise<ProjectCommitData> {
        const created = new this.dataModel(createDataModel);
        return created.save();
    }

    async findAll(): Promise<ProjectCommitData[]> {
        return this.dataModel.find().exec();
    }

    async findByCommitId(projectId: string, commitId: string) {
    }
}
