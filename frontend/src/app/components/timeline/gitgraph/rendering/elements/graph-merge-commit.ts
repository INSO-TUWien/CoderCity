import { Commit } from 'src/app/model/commit.model';
import { Svg } from '@svgdotjs/svg.js';
import { AbstractGraphCommit, GraphCommitState } from './abstract-graph-commit';
import { getBranchColor, getBranchHighlightColor } from '../graph-colors';
import { computeMergeCommitCirclePosition, GridPosition } from '../compute-position';
import { GitGraphCallbacks } from '../callback/callback';

export const MERGE_CIRCLE_WIDTH = 10;
export const CIRCLE_COLOR = '#0AB6B9';

export class GraphMergeCommit extends AbstractGraphCommit {
    private highlightColor: string;
    private state = GraphCommitState.Default;

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

    setState(state: GraphCommitState) {
        if (state === GraphCommitState.Default) {
            this.shape
                .fill({ color: this.color})
                .stroke({ width: 0 });
            this.state = state;
        } else if (state === GraphCommitState.Selected) {
            this.shape
                .stroke({ width: 4, color: this.highlightColor });
            this.state = state;
        } else if (state === GraphCommitState.Highlight) {
            this.shape
                .stroke({ width: 4, color: this.highlightColor });
        }
    }

    render(svg: Svg) {
        this.shape = svg
            .circle(MERGE_CIRCLE_WIDTH)
            .addClass('gitgraph-commit')
            .id(`${this.commit.commitId}`)
            .fill(
                this.color
            )
            .on('mouseover', () => {
                this.setState(GraphCommitState.Highlight);
                this.callbacks?.onGraphCommitMouseOver(this.commit);
            })
            .on('click', () => {
               this.callbacks?.onGraphCommitClick(this.commit);
            })
            .on('mouseout', () => {
                this.setState(this.state);
                this.callbacks?.onGraphCommitMouseOut(this.commit);
            })
            .move(this.x, this.y + MERGE_CIRCLE_WIDTH / 2);
    }
}
