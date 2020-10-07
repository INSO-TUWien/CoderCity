import { ID } from '@datorama/akita';
import { BlameHunk } from './blamehunk.model';

export class File {

    constructor
    (
        public name: ID,
    ) {}

    lineCount: number;
    hunks: BlameHunk[] = [];
}
