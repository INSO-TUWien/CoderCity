import { Injectable, Logger } from '@nestjs/common';
import { GitModel } from 'src/datastore/git-model';
import { GitIndexer } from 'src/git-indexer/git-indexer';
import * as path from 'path';
import { GitBlameWalker } from 'src/git-indexer/git-blame-walker';
import { Repository } from './repo';

export const FOLDER_PATH = path.resolve(__dirname, '../../../../../projects/demo-git-flow/.git');

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);
    public gitModel: GitModel;
    private gitIndexer: GitIndexer;
    private blameWalker: GitBlameWalker;

    public repo: Repository;

    constructor() {}

    async initRepo(): Promise<void> {
        this.repo = new Repository(FOLDER_PATH);
        await this.repo.openRepo();
    }

    async initIndexing() {
        await this.initRepo();
        this.gitModel = new GitModel();
        this.gitIndexer = new GitIndexer(FOLDER_PATH, this.gitModel, this.repo);
        this.blameWalker = new GitBlameWalker(FOLDER_PATH);
        this.gitIndexer.startIndexing();
        this.blameWalker.startIndexing();
    }
}
