import { Branch } from './branch.model';
import { Commit } from './commit.model';

export class GitModel {

    constructor(branches: Branch[], commits: Commit[]) {
        if (branches == null || commits == null) {
            throw new Error('Invalid Arguments: branches or commits are null or undefined');
        }
        this.addCommits(commits);
        this.addBranches(branches);
    }

    // Array of all commits
    commits: Map<string, Commit> = new Map();

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

    addBranch(branch: Branch) {
        this.branches.set(branch.name, branch);
    }

    addBranches(branches: Branch[]) {
        branches.forEach((branch) => {
            this.branches.set(branch.name, branch);
        });
    }

    /**
     * Rebuilds the dag by setting parent commit objects using the parent commit id string array.
     */
    rebuild() {
        // Traverse all branches until all nodes are connected.
        this.branches.forEach(branch => {
            const branchHeadCommit = branch.commit;
            if (branchHeadCommit == null) {
                throw new Error('Branch Head commmit is null');
            }
            this.fetchAndAssignParentCommit(branchHeadCommit);
        });
    }

    private fetchAndAssignParentCommit(commit: Commit) {
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
                if (!commit.parentCommits.some(e => e.commitId === commitID)) {
                    commit.parentCommits.push(parentCommit);
                }

                // Assign current commit node as a child of the parent commit node.
                if (!parentCommit.childCommits.some(
                    c => c.commitId === commit.commitId
                )) {
                    parentCommit.childCommits.push(commit);
                }

                // Update commits in datastructure
                this.commits.set(commit.commitId, commit);
                this.commits.set(parentCommit.commitId, parentCommit);

                this.fetchAndAssignParentCommit(parentCommit);
            } else {
                console.error(`Parent commit ${commitID} does not exist for commit ${commit}.`);
            }
        });
    }
}
