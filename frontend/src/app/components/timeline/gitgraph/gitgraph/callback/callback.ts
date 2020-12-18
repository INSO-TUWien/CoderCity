import { Commit } from 'src/app/model/commit.model';
export type OnGraphCommitMouseOver = (commit: Commit) => any;
export type OnGraphCommitClick = (commit: Commit) => any;
export type OnGraphCommitMouseOut = (commit: Commit) => any;

export interface Callbacks {
    onGraphCommitMouseOver?: OnGraphCommitMouseOver;
    onGraphCommitMouseOut?: OnGraphCommitMouseOut;
    onGraphCommitClick?: OnGraphCommitClick;
}