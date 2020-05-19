import { Injectable, Logger } from '@nestjs/common';
import { GitService } from '../git/git.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);

  constructor(private gitService: GitService) {}

  async getFilesOfCommit(projectId: string, commitId: string): Promise<File[]> {
    const repo = await this.gitService.getRepoByProjectId(projectId);
    return repo.getFilesForCommit(commitId);
  }

  async getFilesWithDirectoriesOfCommit(
    projectId: string,
    commitId: string,
  ): Promise<Directory> {
    const repo = await this.gitService.getRepoByProjectId(projectId);
    return repo.getFilesWithDirectoriesOfCommit(commitId);
  }
}
