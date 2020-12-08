import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from './repo';
import { ConfigService } from '@nestjs/config';
import { Signature } from 'src/model/signature.model';
import { Project, ProjectUtil } from 'src/model/project.model';
import * as path from 'path';
import * as find from 'findit';

@Injectable()
export class GitProjectService {
    private readonly logger = new Logger(GitProjectService.name);

    private projectFolderPath: string;
    private preIndexProjects: string;
    public repositories: Map<string, Repository> = new Map();
    private projects: Project[] = []; // Stores git projects

    constructor(
        private configService: ConfigService,
    ) {
        this.logger.log(`Initializing GitService`);
        this.projectFolderPath = this.configService.get<string>('GIT_PROJECTS_FOLDER');
        this.preIndexProjects = this.configService.get<string>('INDEX_MODE');
        this.logger.log(`Set project path: ${this.projectFolderPath}`);
        this.findAndIndexGitProjects();
    }

    findProject(id: string) {
        const result = this.projects.find((project) => project.id === id);
        if (result === undefined) {
            return {};
        } else {
            return result;
        }
    }

    findAll(): Project[] {
        return this.projects;
    }

    /**
     * Retrieves a list of all git projects given a folder path.
     */
    private findAndIndexGitProjects(): void {
        this.logger.log(`Started indexProjects`);
        const finder = find(this.projectFolderPath);
        // find all git directories
        finder.on('directory', (dir, stat, stop) => {
            const base = path.basename(dir);
            if (base === 'node_modules') {
                stop();
                // Skip looking inside the node_modules folder.
            } else if (base === '.git') {
                this.logger.log(`Found project ${dir}`);
                const projectName = path.dirname(dir).split(path.sep).pop();
                const project = new Project();
                project.fullPath = dir;
                project.name = projectName;
                project.id = ProjectUtil.getProjectId(dir);
                this.projects.push(project);
                // Initialize repo
                this.initRepo(dir);
                stop();
            }
        });
        finder.on('end', () => {
            // All folders traversed
        });
    }

    public async getRepoByProjectId(projectId: string): Promise<Repository> {
        const project = this.projects.find(project => project.id === projectId);
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

    /**
     * Returns a list of all branches of a project given it's project id.
     * @param projectId 
     */
    public async getBranches(projectId: string) {
        const branches = [];
        const repo = await this.getRepoByProjectId  (projectId);
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
            await this.initRepo(projectPath);
            throw new Error('Requested ressource is not ready.');
        }
    }

    /**
     * Initializes git node repo.
     */
    private async initRepo(projectPath: string): Promise<void> {
        const repo = new Repository(projectPath);
        await repo.openRepo();
        await repo.startIndexing();
        // Index project files if pre-index projects flag is set
        // if (this.preIndexProjects == 'EAGER') {
        //     await this.indexProjectFilesForEachCommit(repo);
        // }
        
        this.repositories.set(projectPath, repo);
    }

    // private async indexProjectFilesForEachCommit(repo: Repository) {
    //     if (!repo) {
    //         this.logger.error(`indexProjectFilesForEachCommit: Repo is not defined.`);
    //         return;
    //     }
    //     this.logger.log(`Starting indexing project files for each commit of the project`)
    //     // Index all project files for each commit of the project
    //     await repo.foreachCommit(async (commit) => {
    //         // this.logger.log(`Executing operation projectID: ${commit.projectId} commitID: ${commit.commitId}`);
    //         if (!await this.projectSnapShotService.exists(commit.projectId, commit.commitId)) {
    //             this.logger.log(`Indexing project files: ProjectId: ${commit.projectId} CommitId ${commit.commitId}`);
    //             const result = await repo.getFilesWithDirectoriesOfCommit(commit.commitId);
    //             this.projectSnapShotService.create({
    //                 projectId: commit.projectId,
    //                 commitId: commit.commitId,
    //                 data: JSON.stringify(result)
    //             });
    //         }
    //     });
    // }
}
