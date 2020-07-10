import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ProjectCommitData } from 'src/entities/project-commit-data';
import { Model } from 'mongoose';

/**
 * Repository for project commit data.
 * @See https://docs.nestjs.com/techniques/mongodb
 */

@Injectable()
export class ProjectCommitDataService {
    constructor(@InjectModel(ProjectCommitData.name) private projectCommitDataModel: Model<ProjectCommitData>) {}

    async create(createProjectCommitDataModel: { projectId: string, data: string }): Promise<ProjectCommitData> {
        const created = new this.projectCommitDataModel(createProjectCommitDataModel);
        return created.save();
    }
}
