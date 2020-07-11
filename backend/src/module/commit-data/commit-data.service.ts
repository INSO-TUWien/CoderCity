import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommitData } from './commit-data';

/**
 * Repository for project commit data.
 * @See https://docs.nestjs.com/techniques/mongodb
 */

@Injectable()
export class CommitDataService {
    constructor(@InjectModel(CommitData.name) private dataModel: Model<CommitData>) {}

    async create(createDataModel: { projectId: string, commitId: string, data: string }): Promise<CommitData> {
        const created = new this.dataModel(createDataModel);
        return created.save();
    }

    async findAll(): Promise<CommitData[]> {
        return this.dataModel.find().exec();
    }

    async findByCommitId(projectId: string, commitId: string) {
        return this.dataModel.findOne({
            'projectId': projectId,
            'commitId': commitId
        })
    }
}
