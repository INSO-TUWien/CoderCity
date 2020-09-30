import { BlameHunk } from './blamehunk.model';

export class File {

    constructor(public name: string) {}

    lineCount: number;
    hunks: BlameHunk[] = [];
}
