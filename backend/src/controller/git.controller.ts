import { Controller, Logger, Get } from '@nestjs/common';
import { GitIndexer } from 'src/git-indexer/git-indexer';
import { GitModel } from 'src/datastore/git-model';
import { GitService } from 'src/services/git/git.service';

@Controller('git')
export class GitController {
    private readonly logger = new Logger(GitController.name);
    private readonly GIT_FOLDER_PATH = '';

    constructor(private readonly gitService: GitService) {
        this.logger.log(`Initializing GitController`);
        this.gitService.initIndexing();
    }

    @Get()
    getGit() {
        this.logger.log(`GET: getGit`);
        const result = this.gitService.gitModel.commits.size;
        this.logger.log(`getGit: ${result}`);
        return result;
    }

    @Get('commits')
    getCommits() {
        this.logger.log(`GET: commits`);
        const gitCommits = [];
        for (let [key, value] of this.gitService.gitModel.commits) {
            this.logger.log(`Commit ${value}`);
            gitCommits.push(value);
        }
        return gitCommits;
    }

    @Get('branches')
    getBranches() {
        this.logger.log(`GET: branches`);
        const branches = [];
        for (let [key, value] of this.gitService.gitModel.branches) {
            this.logger.log(`Branch ${value}`);
            branches.push(value);
        }
        return branches;
    }
}
