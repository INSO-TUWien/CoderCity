import { Author } from './author.model';

/**
 * Model for a hunk.
 */
export class BlameHunk {

    constructor(
        public startLineNumber,
        public endLineNumber: number,
        public linesInHunk: number,
        public commitId: string,
        public path: string,
        public signature: Author,
    ) {}

    static fromObject(object: BlameHunk) {
        return new BlameHunk(
            object.startLineNumber, object.endLineNumber,object.linesInHunk, object.commitId, object.path, object.signature);
    }
}

