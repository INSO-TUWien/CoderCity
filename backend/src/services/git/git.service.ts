import { Injectable, Logger } from '@nestjs/common';
import { GitModel } from 'src/datastore/git-model';
import { GitIndexer } from 'src/git-indexer/git-indexer';

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);
    GIT_FOLDER_PATH = '';

    gitModel: GitModel;
    gitIndexer: GitIndexer;

    constructor() {}

    initIndexing() {
        this.gitModel = new GitModel();
        this.gitIndexer = new GitIndexer(this.GIT_FOLDER_PATH, this.gitModel);
        this.gitIndexer.startIndexing();
    }
}
