import { Signature } from "./signature.model";

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
        public signature: Signature,
    ) {}
}
