import { Injectable, Logger } from '@nestjs/common';
import { Repository } from './repo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);

    public repo: Repository;
    private projectPath: string;

    public repositories: Map<string, Repository> = new Map();

    constructor(
        private configService: ConfigService,
    ) {
        this.logger.log(`Initializing GitController`);
        this.projectPath = this.configService.get<string>('GIT_PROJECT_PATH');
        this.logger.log(`Set project path: ${this.projectPath}`);
        this.getRepo(this.projectPath);
    }

    public async getRepo(projectPath: string): Promise<Repository> {
        if (this.repositories.has(projectPath)) {
            return this.repositories.get(projectPath);
        } else {
            // Repository not initialized
            const repo = await this.initRepo(projectPath);
            this.repositories.set(projectPath, repo);
            return repo;
        }
    }

    /**
     * Initializes git node repo.
     */
    private async initRepo(projectPath: string): Promise<Repository> {
        const repo = new Repository(projectPath);
        this.repo = repo;
        await repo.openRepo();
        await repo.startIndexing();
        return this.repo;
    }
}
