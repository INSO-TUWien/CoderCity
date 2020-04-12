import { Commit } from 'src/app/model/commit.model';
import { Svg } from '@svgdotjs/svg.js';
import { AbstractGraphCommit } from './abstract-graph-commit';
import { getBranchColor, getBranchHighlightColor } from '../graph-colors';
import {  computeMergeCommitCirclePosition, GridPosition } from '../compute-position';
import { OnGraphCommitMouseOver, OnGraphCommitClick, GitGraphCallbacks } from '../callback/callback';

export const MERGE_CIRCLE_WIDTH = 10;
export const CIRCLE_COLOR = '#0AB6B9';

export class GraphMergeCommit extends AbstractGraphCommit {
    private highlightColor: string;

    constructor(
        public callbacks: GitGraphCallbacks,
        public readonly gridPosition: GridPosition,
        public commit: Commit,
        public color: string = CIRCLE_COLOR
    ) {
        super(callbacks);
        if (gridPosition.x < 0 && gridPosition.y < 0) {
            console.error(`GraphMergeCommit: Invalid parameters graphPosition are null or undefined`);
            return;
        }
        this.color = getBranchColor(this.gridPosition.y);
        this.highlightColor = getBranchHighlightColor(this.gridPosition.y);

        const pixelCoordinates = computeMergeCommitCirclePosition({ x: gridPosition.x, y: gridPosition.y});
        this.x = pixelCoordinates.x;
        this.y = pixelCoordinates.y;
        this.graphPositionX = this.gridPosition.x;
        this.graphPositionY = this.gridPosition.y;
    }

    render(svg: Svg) {
        const circle = svg
            .circle(MERGE_CIRCLE_WIDTH)
            .addClass('gitgraph-commit')
            .fill(
                this.color
            )
            .on('mouseover', () => {
                circle
                    .stroke({ width: 4, color: this.highlightColor });
                this.callbacks?.onGraphCommitMouseOver(this.commit);
            })
            .on('click', () => {
               this.callbacks?.onGraphCommitClick(this.commit);
            })
            .on('mouseout', () => {
                circle
                    .fill({ color: this.color})
                    .stroke({ width: 0 });
                this.callbacks?.onGraphCommitMouseOut(this.commit);
            })
            .move(this.x, this.y + MERGE_CIRCLE_WIDTH / 2);
    }
}
