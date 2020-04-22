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

    /**
     * Retrieves an array of all commits.
     * (Filter: commits in between startCommitId (earliest by date) and endCommitId (latest by date))
     */
    @Get('')
    async getCommits(
        @Query('start') startCommitId,
        @Query('end') endCommitId
    ) {
        this.logger.log(`start ${startCommitId} end ${endCommitId}`);
        const result = [];
        if (startCommitId == null && endCommitId == null) {
            // Retrieve all commits
            for (let [key, value] of this.gitService.gitModel.commits) {
                result.push(value);
            }
        } else if (startCommitId != null && endCommitId != null) {
            // Apply filter
            const result = await this.gitService.repo.getCommitsBetween(startCommitId, endCommitId);
            return result;
        }
        return result;
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
