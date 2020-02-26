import { BlameHunk } from './blamehunk.model';

export class File {

    constructor(public name: string) {}

    hunks: BlameHunk[] = [];
}
