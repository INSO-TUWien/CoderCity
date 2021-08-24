import { Injectable, Logger } from '@nestjs/common';
import { GitProjectService } from '../git/git-project.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);

  constructor(
    private gitService: GitProjectService
  ) { }

  /**
   * Returns an array of all files of project without preserving nesting directories.
   * @param projectId 
   * @param commitId 
   */
  async getFilesOfCommit(projectId: string, commitId: string): Promise<File[]> {
    const repo = await this.gitService.getRepoByProjectId(projectId);
    return repo.getFilesForCommit(commitId);
  }

  /**
   * Returns all files of project preserving nesting in sub directories.
   */
  async getFilesWithNestedDirectoriesOfCommit(
    projectId: string,
    commitId: string,
  ): Promise<Directory> {
    // Entry for commit does not exist in database. Create new entry and return result.
    const repo = await this.gitService.getRepoByProjectId(projectId);
    const result = await repo.getFilesWithDirectoriesOfCommit(commitId);
    return result;
  }

  async getCommitsBetween(
    projectId: string,
    startId: string,
    endId: string
  ) {
    const repo = this.gitService.getRepoByProjectId(projectId);
    
  }
}
