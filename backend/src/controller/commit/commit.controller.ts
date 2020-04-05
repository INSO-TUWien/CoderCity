import { Controller, Param, Get, Post, Logger, Query } from '@nestjs/common';
import { CommitService } from 'src/services/commit/commit.service';
import { File } from "src/model/file.model";
import { Directory } from 'src/model/directory.model';
import { GitService } from 'src/services/git/git.service';

@Controller('commit')
export class CommitController {
    private readonly logger = new Logger(CommitController.name)

    constructor(
        private commitService: CommitService,
        private gitService: GitService
    ) {}

    @Get('')
    getCommits() {
        const gitCommits = [];
        for (let [key, value] of this.gitService.gitModel.commits) {
            gitCommits.push(value);
        }
        return gitCommits;
    }

    @Get(':id')
    async getProjectFilesByCommitId(@Param('id') id, @Query('mode') mode): Promise<File[] | Directory> {
        if (mode === 'directory') {
            const projectRootFolder = await this.commitService.getFilesWithDirectoriesOfCommit(id);
            return projectRootFolder;
        } else {
            const files = await this.commitService.getFilesOfCommit(id);
            return files;
        }
    }
}
