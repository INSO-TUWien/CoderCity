import { Commit } from 'src/app/model/commit.model';
import { generateGraphLineKey } from '../elements/graph-line';

export interface CommitsBetweenResult {
  commitIds: string[];
  lineCommitKeys: string[];
}

export class Util {

    static getCommitsBetweenAsLineIds(
        startCommitId: string,
        endCommitId: string,
        commits: Map<string, Commit>
      ): CommitsBetweenResult {
        const parentResult = Util.getCommitsBetweenByParent(startCommitId, endCommitId, commits);
        const childrenResult = Util.getCommitsBetweenByChildren(endCommitId, startCommitId, commits);
        const result = { commitIds: [], lineCommitKeys: []};
        result.commitIds = parentResult.commitIds.filter(parentCommitId => childrenResult.commitIds.includes(parentCommitId));
        result.lineCommitKeys =
          parentResult
            .lineCommitKeys
            .filter(parentLineCommitKey => childrenResult.lineCommitKeys.includes(parentLineCommitKey));
        return result;
    }

    private static getCommitsBetweenByParent(
      commitId: string,
      endCommitId: string,
      commits: Map<string, Commit>,
      result: CommitsBetweenResult = { commitIds: [], lineCommitKeys: []}
      ): CommitsBetweenResult {
      if (commitId === endCommitId) {
        return result;
      }

      if (
        commits.has(commitId) &&
        commits.has(endCommitId) &&
        !Commit.isCommitBeforeOtherCommit(commitId, endCommitId, commits)) {
        const curCommit = commits.get(commitId);
        curCommit.parentCommitIDs.forEach((parentCommitId) => {
          if (!Commit.isCommitBeforeOtherCommit(parentCommitId, endCommitId, commits)) {
            result.commitIds.push(commitId);
            result.lineCommitKeys.push( generateGraphLineKey(curCommit.commitId, parentCommitId));
            return Util.getCommitsBetweenByParent(parentCommitId, endCommitId, commits, result);
          }
        });
      }
      return result;
  }

    private static getCommitsBetweenByChildren(
      commitId: string,
      endCommitId: string,
      commits: Map<string, Commit>,
      result: CommitsBetweenResult = { commitIds: [], lineCommitKeys: []}
    ): CommitsBetweenResult {
      if (commitId === endCommitId) {
        return result;
      }

      if (
        commits.has(commitId) &&
        commits.has(endCommitId) &&
        !Commit.isCommitBeforeOtherCommit(endCommitId, commitId, commits)) {
        const curCommit = commits.get(commitId);
        curCommit.childCommitIDs.forEach((childCommitId) => {
          if (!Commit.isCommitBeforeOtherCommit(endCommitId, commitId, commits)) {
            result.commitIds.push(commitId);
            result.lineCommitKeys.push( generateGraphLineKey(childCommitId, curCommit.commitId));
            return Util.getCommitsBetweenByChildren(childCommitId, endCommitId, commits, result);
          }
        });
      }

      return result;
    }
}
