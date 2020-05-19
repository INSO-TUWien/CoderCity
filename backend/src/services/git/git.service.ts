import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from './repo';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from '../project/project.service';
import { Signature } from 'src/model/signature.model';


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
    
    public async getCommits(projectId: string) {
        const result = [];
        const repo = await this.getRepoByProjectId(projectId);
        for (let [key, value] of repo.gitModel.commits) {
          result.push(value);
        }
        return result;
    }

    public async getBranches(projectId: string) {
        const branches = [];
        const repo = await this.getRepoByProjectId(projectId);
        for (let [key, value] of repo.gitModel.branches) {
            this.logger.log(`Branch ${value}`);
            branches.push(value);
        }
        return branches;
    }

    public async getAuthors(projectId: string) {
        const authors = [];
        const repo = await this.getRepoByProjectId(projectId);
        repo.gitModel.commits.forEach((commit) => {
            // Check whether author already is in array
            const authorExists = authors.map((author) =>
                author.name === commit.authorName &&
                author.email === commit.mail
            ).reduce((prev, cur) => prev || cur, false);

            if (!authorExists) {
                authors.push(new Signature(commit.authorName, commit.mail));
            }
        });
        return authors;
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
