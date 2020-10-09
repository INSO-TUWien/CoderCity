import { ID } from '@datorama/akita';
import { BlameHunk } from './blamehunk.model';

export class File {
    name: ID;
    fullPath?: string;
    lineCount: number;
    hunks: BlameHunk[] = [];
}
