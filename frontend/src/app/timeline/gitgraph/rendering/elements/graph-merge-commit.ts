import { AbstractStoreRenderElement } from '../abstract-store-render-element';
import { Store } from '@ngrx/store';
import { Commit } from 'src/app/shared/git/commit.model';
import { CommitCircleStyle } from './graph-commit';
import { State } from 'src/app/reducers';
import { Svg } from '@svgdotjs/svg.js';
import * as GitActions from '../../git.action';

export const MERGE_CIRCLE_WIDTH = 10;
export const CIRCLE_COLOR = '#0AB6B9';

export class GraphMergeCommit extends AbstractStoreRenderElement {

    constructor(
        public store: Store<State>,
        public x: number,
        public y: number,
        public commit: Commit,
        public color: string = CIRCLE_COLOR
    ) {
        super(store);
    }

    render(svg: Svg) {
        svg
            .circle(MERGE_CIRCLE_WIDTH)
            .fill(CIRCLE_COLOR)
            .on('mouseover', () => {
                this.store.dispatch(
                    GitActions.setCommitPreview(
                        {
                            commitPreview: this.commit
                        }
                    )
                );
              })
            .move(this.x, this.y + MERGE_CIRCLE_WIDTH / 2);
    }
}
