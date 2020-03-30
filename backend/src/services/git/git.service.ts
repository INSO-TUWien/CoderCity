import { Injectable, Logger } from '@nestjs/common';
import { GitModel } from 'src/datastore/git-model';
import { GitIndexer } from 'src/services/git/git-indexer';
import * as path from 'path';
import { Repository } from './repo';

export const EXAMPLE_PROJECT1_PATH = '../../../../../projects/demo-git-flow/.git';
export const EXAMPLE_PROJECT2_PATH = '../../../../../projects/gitflow-sample/.git';
export const EXAMPLE_PROJECT3_PATH = '../../../../../projects/ue2_github/.git';

export const FOLDER_PATH = path.resolve(__dirname, EXAMPLE_PROJECT2_PATH);

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);
    public gitModel: GitModel;
    private gitIndexer: GitIndexer;

    public repo: Repository;

    constructor() {
        this.logger.log(`Initializing GitController`);
        this.initIndexing();
    }

    async initRepo(): Promise<void> {
        this.repo = new Repository(FOLDER_PATH);
        await this.repo.openRepo();
    }

    async initIndexing() {
        await this.initRepo();
        this.gitModel = new GitModel();
        this.gitIndexer = new GitIndexer(FOLDER_PATH, this.gitModel, this.repo);
        this.gitIndexer.startIndexing ();
    }
}
