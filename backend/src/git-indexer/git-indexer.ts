import { Repository, Revwalk, Reference, Commit } from 'nodegit';
import * as path from 'path';
import { Branch } from 'src/model/branch';
import { Commit as CommitModel } from 'src/model/commit';
import * as fs from 'fs';
import { GitModel } from 'src/datastore/git-model';
import { Logger } from '@nestjs/common';

export class GitIndexer {
    private readonly logger = new Logger(GitIndexer.name);

    private gitFolderPath: string;
    private gitModel: GitModel;

    constructor(gitFolderPath: string, gitModel: GitModel) {
        this.gitFolderPath = path.resolve(__dirname, '../../../../projects/demo-git-flow/.git');
        this.gitModel = gitModel;
    }

    async startIndexing(): Promise<void> {
        this.logger.log(`Indexing Git folder at ${this.gitFolderPath}`);
        const repo = await Repository.open(this.gitFolderPath);
        await this.indexAllGitCommits(repo);
        await this.indexBranchRefCommits(repo);
    }

    private async indexAllGitCommits(repo: Repository) {
        const branchNames = await GitIndexer.getAllBranchNames(repo);
        this.logger.log(`Detected branches: ${branchNames}`);
        branchNames.forEach(async (branch) => {
            this.logger.log(`Indexing branch ${branch}`);
            const walker = Revwalk.create(repo);
            const branchCommit = await repo.getBranchCommit(branch);
            walker.push(branchCommit.id());
            walker.sorting(Revwalk.SORT.TOPOLOGICAL);
            walker.getCommitsUntil(() => true)
                .then(async (commits) => {
                    const cmts = await Promise.all(commits.map(GitIndexer.nodeGitCommitToCommitModel));
                    try {
                        this.gitModel.addCommits(cmts);
                    } catch (e) {
                        this.logger.error(`Could not add commits to git model ${e}`);
                    }

                   /*  fs.appendFileSync(
                        './gitlog/commits.txt',
                        `Branch : ${branch}\n` +
                         cmts.map(value => value.toString()).reduce((prev, cur) => prev + '\n' + cur));
                    this.logger.log(`Finished indexing branch ${branch}`); */
            });
        });
    }

    private async indexBranchRefCommits(repo: Repository) {
        const branchNames = await GitIndexer.getAllBranchNames(repo);
        this.logger.log(`branch names: ${branchNames}`);
        const branches = await this.getBranches(repo, branchNames);
        this.logger.log(`Adding branches: ${branches}`);
        this.gitModel.addBranches(branches);
    }

    async getBranches(repo: Repository, branchNames: string[]): Promise<Branch[]> {
        let result: Branch[] = [];
        result = await Promise.all(branchNames.map(async (branchRef) => {
            const branch = new Branch();
            branch.name = branchRef;
            const branchCommit = await repo.getBranchCommit(branchRef);
            branch.commit = await GitIndexer.nodeGitCommitToCommitModel(branchCommit);
            this.logger.debug(`branch: ${JSON.stringify(branch)}`);
            return branch;
        }));
        return result;
    }

    static nodeGitCommitToCommitModel = async (commit: Commit) => {
        return new CommitModel(
            commit.sha(),
            commit.author().name(),
            commit.author().email(),
            commit.date(),
            commit.message(),
            (await commit.getParents(null)).map((commit) => commit.sha()),
        );
    }

    static getAllBranchNames(repo: Repository): Promise<string[]> {
        return repo.getReferenceNames(Reference.TYPE.LISTALL);
    }
}
