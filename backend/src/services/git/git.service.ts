import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from './repo';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../project/project.service';

@Injectable()
export class GitService {
    private readonly logger = new Logger(GitService.name);

    private repo: Repository;
    private projectPath: string;

    public repositories: Map<string, Repository> = new Map();

    constructor(
        private configService: ConfigService,
        private projectService: ProjectService
    ) {
        this.logger.log(`Initializing GitController`);
        this.projectPath = this.configService.get<string>('GIT_PROJECT_PATH');
        this.logger.log(`Set project path: ${this.projectPath}`);
    }

    public async getRepoByProjectId(projectId: string): Promise<Repository> {
        const project = this.projectService.projects.find(project => project.id === projectId);
        if (project != undefined) {
            return this.getRepo(project.fullPath);
        } else {
            throw new NotFoundException(`The project with ${projectId} does not exist`);
        }
    }

    public async getRepo(projectPath: string): Promise<Repository> {
        if (this.repositories.has(projectPath)) {
            return this.repositories.get(projectPath);
        } else {
            // Repository not initialized
            const repo = await this.initRepo(projectPath);
            throw new Error('Requested ressource is not ready.');
        }
    }

    /**
     * Initializes git node repo.
     */
    private async initRepo(projectPath: string): Promise<void> {
        const repo = new Repository(projectPath);
        this.repo = repo;
        await repo.openRepo();
        await repo.startIndexing();
        this.repositories.set(projectPath, repo);
    }
}
