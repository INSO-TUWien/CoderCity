import { Branch } from '../model/branch.model';
import { Commit } from '../model/commit.model';
import { Logger } from '@nestjs/common';

export class GitModel {
    private readonly logger = new Logger(GitModel.name);

    constructor() {}

    // Map of all commits with sha commit id as hash key
    commits: Map<string, Commit> = new Map();

    // Commits sorted by time as array.
    commitsSortedByTime: Commit[] = [];

    // Commits with no parent
    rootCommits: Set<string> = new Set();

    // heads of all available branches
    branches: Map<string, Branch> = new Map();

    addCommit(commit: Commit) {
        this.commits.set(commit.commitId, commit);
        if (!Array.isArray(commit.parentCommitIDs)) {
            // Commit does not have any parent commits. Add to root commits
            this.rootCommits.add(commit.commitId);
        }

        this.rebuild();
    }

    addCommits(commits: Commit[]) {
        if (commits == null) {
            throw new Error('Invalid Arguments: GitModel or Commit object are null');
        }

        commits.forEach((commit) => {
            if (!this.commitExists(commit.commitId)) {
                this.addCommit(commit);
            }
        });

        this.rebuild();
    }

    commitExists(commitId: string): boolean {
        return this.commits.has(commitId);
    }

    getCommit(commitId: string): Commit {
        if (this.commitExists(commitId)) {
            return this.commits.get(commitId);
        } else {
            throw Error(`Commit with commit id does not exist: ${commitId}`);
        }
    }

    addBranch(branch: Branch): void {
        this.branches.set(branch.name, branch);
    }

    addBranches(branches: Branch[]): void {
        branches.forEach((branch) => {
            this.branches.set(branch.name, branch);
        });
    }

    sortCommitsByTime(): void {
        const commits = Array.from(this.commits.values());
        this.commitsSortedByTime = commits.sort(
            (a: Commit, b: Commit) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        // this.logger.debug(`SortedCommits: ${JSON.stringify(this.commitsSortedByTime)}`);
    }

    /**
     * Rebuilds the dag by setting parent commit objects using the parent commit id string array.
     */
    rebuild() {
        this.commits.forEach((commit) => {
            this.computeParentAndChildReferences(commit);
        });
        this.sortCommitsByTime();
    }

    private computeParentAndChildReferences(commit: Commit) {
        // this.logger.log(`computeParentChild ${commit.message}`);
        const parentCommitIDs = commit.parentCommitIDs;
        if (!Array.isArray(parentCommitIDs) || parentCommitIDs.length === 0) {
            // Current commit has no parent commit nodes / is root commit node
            this.rootCommits.add(commit.commitId);
        }

        // In all parent commits of the current commit, set the children commits field to the current one.
        parentCommitIDs.forEach(commitID => {
            if (this.commitExists(commitID)) {
                const parentCommit = this.getCommit(commitID);
                // Assign parent commit node as a parent commit in current commit node.
                if (!commit.parentCommitIDs.some(parentCommitID => parentCommitID === commitID)) {
                    commit.parentCommitIDs.push(parentCommit.commitId);
                }

                // Assign current commit node as a child of the parent commit node.
                if (!parentCommit.childCommitIDs.some(
                    commitId => commitId === commit.commitId
                )) {
                    parentCommit.childCommitIDs.push(commit.commitId);
                }

                // Update commits in datastructure
                //this.commits.delete(commit.commitId);
                //this.commits.delete(parentCommit.commitId);
                this.commits.set(commit.commitId, commit);
                this.commits.set(parentCommit.commitId, parentCommit);
            } else {
                this.logger.error(`Parent commit ${commitID} does not exist for commit ${commit}.`);
            }
        });
    }
}
