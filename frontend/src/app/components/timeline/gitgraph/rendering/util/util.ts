import { Commit } from 'src/app/model/commit.model';
import { generateGraphLineKey } from '../elements/graph-line';

export class Util {
    static getCommitsBetweenAsLineIds(
        commitId: string,
        endCommitId: string,
        commits: Map<string, Commit>,
        result: string[] = []): string[] {
        if (commitId === endCommitId) {
          return result;
        }

        if (commits.has(commitId) && commits.has(endCommitId) && !Commit.isCommitBeforeOtherCommit(commitId, endCommitId, commits)) {
          const curCommit = commits.get(commitId);
          curCommit.parentCommitIDs.forEach((parentCommitId) => {
            if (!Commit.isCommitBeforeOtherCommit(parentCommitId, endCommitId, commits)) {
              result.push(generateGraphLineKey(curCommit.commitId, parentCommitId));
              return Util.getCommitsBetweenAsLineIds(parentCommitId, endCommitId, commits, result);
            }
          });
        }
        return result;
      }
}

