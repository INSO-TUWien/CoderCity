import { Injectable, Logger } from '@nestjs/common';
import { GitProjectService } from '../git/git-project.service';
import { File } from 'src/model/file.model';
import { Directory } from 'src/model/directory.model';
import { ProjectSnapshotService } from 'src/module/projectsnapshot/project-snapshot.service';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);

  constructor(
    private gitService: GitProjectService,
    private commitDataService: ProjectSnapshotService
  ) {}

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
    // Check if entry for this commit exists in mongodb
    const dbCommitData = await this.commitDataService.findByCommitId(projectId, commitId);
    if (!dbCommitData) {
      // Entry for commit does not exist in database. Create new entry and return result.
      const repo = await this.gitService.getRepoByProjectId(projectId);
      const result = await repo.getFilesWithDirectoriesOfCommit(commitId);
      this.commitDataService.create({
        projectId: projectId,
        commitId: commitId,
        data: JSON.stringify(result)
      })
      return result;
    } else {
      // Get preprocessed entry from db.
      this.logger.log(`Requested commit data with projectId: ${projectId} commitId: ${commitId} exists in database. Queried data from database.`)
      const result = JSON.parse(dbCommitData.data);
      return result;
    }
  }

  /**
   * Create a database entry of project snapshot (the state of the project at a given commit) if it does not exist.
   * @param projectId 
   * @param commitId 
   */
  private async createProjectSnapshotEntryForCommit(projectId: string, commitId: string) {
    if (!this.commitDataService.exists(projectId, commitId)) {
      this.logger.log(`createDBEntryForCommit: ${projectId}, ${commitId} does not exist in database. Creating database entry.`);
      const repo = await this.gitService.getRepoByProjectId(projectId);
      const result = await repo.getFilesWithDirectoriesOfCommit(commitId);
      this.commitDataService.create({
        projectId: projectId,
        commitId: commitId,
        data: JSON.stringify(result)
      });
    }
  }

}
