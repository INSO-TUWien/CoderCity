import { Controller, Param, Get, Post, Logger, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { CommitService } from 'src/services/commit/commit.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';
import { GitProjectService } from 'src/services/git/git-project.service';

@Controller('api/project/:projectId/commit')
export class CommitController {
  private readonly logger = new Logger(CommitController.name);

  constructor(
    private commitService: CommitService,
    private gitService: GitProjectService,
  ) { }

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
    @Param('id') id
  ): Promise<File[] | Directory> {
    try {
      const projectRootFolder = await this.commitService.getFilesWithNestedDirectoriesOfCommit(
        projectId,
        id,
      );
      return projectRootFolder;
    } catch (e) {
      throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
    }
  }

  @Get(':id')
  async getCommitIdsBetween(
    @Param('start') startCommitId,
    @Param('end') endCommitId) {
    let result = [];
    
    return ""; 
  }

  @Get(':id/files')
  async getFilesByCommitId(
    @Param('projectId') projectId,
    @Param('id') id
  ): Promise<File[]> {
    try {
      const files = await this.commitService.getFilesOfCommit(projectId, id);
      return files;
    } catch (e) {
      throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
    }
  }
}
