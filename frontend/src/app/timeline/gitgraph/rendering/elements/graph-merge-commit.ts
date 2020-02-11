import { Store } from '@ngrx/store';
import { Commit } from 'src/app/shared/git/commit.model';
import { State } from 'src/app/reducers';
import { Svg } from '@svgdotjs/svg.js';
import * as GitActions from '../../git.action';
import { AbstractGraphCommit } from './abstract-graph-commit';
import { getBranchColor, getBranchHighlightColor } from '../graph-colors';

export const MERGE_CIRCLE_WIDTH = 10;
export const CIRCLE_COLOR = '#0AB6B9';

export class GraphMergeCommit extends AbstractGraphCommit {
    private highlightColor: string;

    constructor(
        public store: Store<State>,
        public x: number,
        public y: number,
        public graphPositionX: number,
        public graphPositionY: number,
        public commit: Commit,
        public color: string = CIRCLE_COLOR
    ) {
        super(store);
        this.color = getBranchColor(this.graphPositionY);
        this.highlightColor = getBranchHighlightColor(this.graphPositionY);
    }

    render(svg: Svg) {
        const circle = svg
            .circle(MERGE_CIRCLE_WIDTH)
            .fill(
                this.color
            )
            .on('mouseover', () => {
                this.store.dispatch(
                    GitActions.setCommitPreview(
                        {
                            commitPreview: this.commit
                        }
                    )
                );
                circle
                    .stroke({ width: 4, color: this.highlightColor });
              })
            .on('mouseout', () => {
                circle
                    .fill({ color: this.color})
                    .stroke({ width: 0 });
            })
            .move(this.x, this.y + MERGE_CIRCLE_WIDTH / 2);
    }
}
