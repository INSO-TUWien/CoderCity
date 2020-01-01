export class Commit {
    commitId: string;
    authorName: string;
    mail: string;
    date: string;
    message: string;
    parentCommitIDs: string[];
    parentCommits: Commit[];
    parentCommitSet: Set<Commit>;
    _childCommits: Commit[];

    constructor(
      commitId: string,
      authorName: string,
      mail: string,
      date: string,
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

    get childCommits(): Commit[] {
      if (this._childCommits == null) {
        this._childCommits = [];
      }
      return this._childCommits;
    }

    set childCommits(commits: Commit[]) {
      this._childCommits = commits;
    }

    outputConsole() {
      console.log('SHA: ' + this.commitId);
      console.log('Author:', this.authorName + ' <' + this.mail + '>');
      console.log('Date:', this.date);
      console.log('\n    ' + this.message);
      console.log(`Parent Commits: ${this.parentCommitIDs}\n`);
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
