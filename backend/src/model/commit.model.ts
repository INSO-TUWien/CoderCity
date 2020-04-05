export class Commit {
  commitId: string;
  authorName: string;
  mail: string;
  date: Date;
  message: string;
  parentCommitIDs: string[] = [];
  childCommitIDs: string[] = [];

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

  toString(): string {
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
