import { Controller, Param, Get, Post, Logger, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { CommitService } from 'src/services/commit/commit.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';
import { GitService } from 'src/services/git/git.service';
import { ProjectService } from 'src/services/project/project.service';

@Controller('project/:projectId/commit')
export class CommitController {
  private readonly logger = new Logger(CommitController.name);

  constructor(
    private commitService: CommitService,
    private gitService: GitService,
  ) {}

  /**
   * Retrieves an array of all commits.
   */
  @Get('')
  async getCommits(
    @Param('projectId') projectId,
  ) {
    const result = [];
    // Retrieve all commits
    try {
      const repo = await this.gitService.getRepoByProjectId(projectId);
      for (let [key, value] of repo.gitModel.commits) {
        result.push(value);
      }
    } catch (error) {
      throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
    }
    return result;
  }

  @Get(':id')
  async getProjectFilesByCommitId(
    @Param('projectId') projectId,
    @Param('id') id,
    @Query('mode') mode,
  ): Promise<File[] | Directory> {
    try {
      if (mode === 'directory') {
        const projectRootFolder = await this.commitService.getFilesWithDirectoriesOfCommit(
          projectId,
          id,
        );
        return projectRootFolder;
      } else {
        const files = await this.commitService.getFilesOfCommit(projectId, id);
        return files;
      }
    } catch (e) {
      throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
    }
  }
}
