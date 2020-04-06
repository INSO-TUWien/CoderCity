import { Injectable, Logger } from '@nestjs/common';
import { GitModel } from 'src/datastore/git-model';
import { GitIndexer } from 'src/services/git/git-indexer';
import { Repository } from './repo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);
    public gitModel: GitModel;
    private gitIndexer: GitIndexer;

    public repo: Repository;
    private projectPath: string;

    constructor(
        private configService: ConfigService,
    ) {
        this.logger.log(`Initializing GitController`);
        this.projectPath = this.configService.get<string>('GIT_PROJECT_PATH');
        this.logger.log(`Set project path: ${this.projectPath}`);
        this.initIndexing();
    }

    async initRepo(): Promise<void> {
        this.repo = new Repository(this.projectPath);
        await this.repo.openRepo();
    }

    async initIndexing() {
        await this.initRepo();
        this.gitModel = new GitModel();
        this.gitIndexer = new GitIndexer(this.projectPath, this.gitModel, this.repo);
        this.gitIndexer.startIndexing ();
    }
}
