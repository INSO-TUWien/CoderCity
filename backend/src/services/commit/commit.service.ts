import { Injectable, Logger } from '@nestjs/common';
import { GitService } from '../git/git.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';
import { CommitDataService } from 'src/module/commit-data/commit-data.service';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);

  constructor(
    private gitService: GitService,
    private commitDataService: CommitDataService
  ) {}

  async getFilesOfCommit(projectId: string, commitId: string): Promise<File[]> {
    const repo = await this.gitService.getRepoByProjectId(projectId);
    return repo.getFilesForCommit(commitId);
  }

  async getFilesWithDirectoriesOfCommit(
    projectId: string,
    commitId: string,
  ): Promise<Directory> {
    const repo = await this.gitService.getRepoByProjectId(projectId);
    const result = repo.getFilesWithDirectoriesOfCommit(commitId);
    const resultData = await result;
    this.commitDataService.create({
      projectId: projectId,
      commitId: commitId,
      data: JSON.stringify(resultData)
    })
    return result;
  }
}
