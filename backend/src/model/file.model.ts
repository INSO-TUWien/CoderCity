import { BlameHunk } from './blamehunk.model';

export class File {

    public fullPath: string;
    public lineCount: number;

    constructor(public name: string) {}

    hunks: BlameHunk[] = [];
}

export function calculateLinecount(file: File): number {
    // Total file line count is the highest linenumber of the last hunk.
    if (file.hunks.length > 0) {
        return file.hunks[file.hunks.length - 1].endLineNumber;
    } else {
        return 0;
    }
}
