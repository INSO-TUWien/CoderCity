import {
  Repository as NodeGitRepository,
  Revwalk,
  Reference,
  Commit,
} from 'nodegit';
import { Branch } from '../../model/branch.model';
import { Commit as CommitModel } from '../../model/commit.model';
import { GitProject } from 'src/services/git/git-project';
import { Logger } from '@nestjs/common';
import { Repository } from 'src/services/git/repo';
import { ProjectUtil } from 'src/model/project.model';

export class RepoIndexer {
  private readonly logger = new Logger(RepoIndexer.name);

  constructor(
    private gitFolderPath: string,
    private gitModel: GitProject,
    private repo: Repository,
  ) {
    this.logger.debug(`Created Git Indexer for FOLDER_PATH: ${this.gitFolderPath}`);
  }

  async startIndexing(): Promise<void> {
    await this.indexCommits(this.repo.getRepo());
    await this.indexBranches(this.repo.getRepo());
  }

  /**
   * Executes a given operation on all traversed commits.
   * @param repo 
   */
  async foreachCommit(repo: NodeGitRepository, operation: (commitData: { projectId: string; commitId: string }) => void) {
    const branchNames = await RepoIndexer.getAllBranchNames(repo);
    const projectId = ProjectUtil.getProjectId(this.gitFolderPath);
    await branchNames.forEach(async branch => {
      this.logger.log(`Indexing commits of branch ${branch}`);
      const walker = Revwalk.create(repo);
      const branchCommit = await repo.getBranchCommit(branch);
      if (branchCommit != null) {
        walker.push(branchCommit.id());
        walker.sorting(Revwalk.SORT.TOPOLOGICAL);
        await walker
          .getCommitsUntil(() => true)
          .then(async (commits: Commit[]) => {
            // Get all commit ids (sha) and proceed with indexing all project files at that commit and saving result to the mongodb database
            commits.forEach(commit => {
              const commitId = commit.sha();
              // Execute externally provided operation
              operation({
                projectId: projectId,
                commitId: commitId
              });
            })
          });
      }
    });
  }

  private async indexCommits(repo: NodeGitRepository) {
    const branchNames = await RepoIndexer.getAllBranchNames(repo);
    this.logger.log(`getAllCommits: Detected branches: ${branchNames}`);
    let result = [];
    await branchNames.forEach(async branch => {
      this.logger.log(`Indexing commits of branch ${branch}`);
      const walker = Revwalk.create(repo);
      const branchCommit = await repo.getBranchCommit(branch);
      if (branchCommit != null) {
        walker.push(branchCommit.id());
        walker.sorting(Revwalk.SORT.TOPOLOGICAL);
        await walker
          .getCommitsUntil(() => true)
          .then(async commits => {
            result = await Promise.all(
              commits.map(RepoIndexer.nodeGitCommitToCommitModel),
            );
            try {
              this.gitModel.addCommits(result);
            } catch (e) {
              this.logger.error(`Could not add commits to git model ${e}`);
            }
          });
      }
    });
    return result;
  }

  private async indexBranches(repo: NodeGitRepository) {
    const branchNames = await RepoIndexer.getAllBranchNames(repo);
    this.logger.log(`branch names: ${branchNames}`);
    // TODO FIX
    const branches = await this.getBranches(repo, branchNames);
    this.logger.log(`Adding ${branches.length} branches to repository`);
    this.gitModel.addBranches(branches);
  }

  async getBranches(
    repo: NodeGitRepository,
    branchNames: string[],
  ): Promise<Branch[]> {
    let result: Branch[] = [];
    result = await Promise.all(
      branchNames.map(async branchRef => {
        try {
          const branch = new Branch();
          branch.name = branchRef;
          const branchCommit = await repo.getBranchCommit(branchRef);
          branch.commit = await RepoIndexer.nodeGitCommitToCommitModel(
            branchCommit,
          );
          this.logger.debug(`branch: ${JSON.stringify(branch)}`);
          return branch;
        } catch (e) {
          this.logger.error(
            `getBranches: Could not retrieve related commit for branch: ${branchRef}`,
          );
          const branch = new Branch();
          branch.name = branchRef;
          return branch;
        }
      }),
    );
    return result;
  }

  static nodeGitCommitToCommitModel = async (commit: Commit) => {
    return new CommitModel(
      commit.sha(),
      commit.author().name(),
      commit.author().email(),
      commit.date(),
      commit.message(),
      (await commit.getParents(null)).map(commit => commit.sha()),
    );
  };

  static getAllBranchNames(repo: NodeGitRepository): Promise<string[]> {
    return repo.getReferenceNames(Reference.TYPE.LISTALL);
  }
}
