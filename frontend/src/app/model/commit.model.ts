export class Commit {
  commitId: string;
  authorName: string;
  mail: string;
  date: Date;
  message: string;
  parentCommitIDs: string[] = [];
  childCommitIDs: string[] = [];
  //parentCommits: Commit[] = [];
  //childCommits: Commit[] = [];

  constructor(
    commitId: string,
    authorName: string,
    mail: string,
    date: Date,
    message: string,
    parentCommitIDs: string[],
  ) {
    this.commitId = commitId;
    this.authorName = authorName;
    this.mail = mail;
    this.date = date;
    this.message = message;
    this.parentCommitIDs = parentCommitIDs;
  }

  static isMergeCommit(commit: Commit) {
    if (commit?.parentCommitIDs?.length >= 2) {
      return true;
    } else {
      return false;
    }
  }

  static hasChildNodes(commit: Commit) {
    if (commit?.childCommitIDs?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  static isCommitBeforeOtherCommit(firstCommitId: string, secondCommitId: string, commits: Map<string, Commit>): boolean {
    const firstCommit = commits.get(firstCommitId);
    const secondCommit = commits.get(secondCommitId);
    return firstCommit.date < secondCommit.date;
  }

  toString() {
    let result =
      '\n ----- COMMIT -------' +
      '\nSHA: ' +
      this.commitId +
      '\nAuthor:' +
      this.authorName +
      ' <' +
      this.mail +
      '>' +
      '\nDate:' +
      this.date +
      '\n    ' +
      this.message +
      `\nParent Commits: ${this.parentCommitIDs}\n`;
    return result;
  }
}
