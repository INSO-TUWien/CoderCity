import { Commit } from 'src/app/shared/git/commit.model';
import { Svg } from '@svgdotjs/svg.js';
import { State } from 'src/app/reducers';
import * as GitActions from '../../git.action';
import { Store } from '@ngrx/store';
import { AbstractGraphCommit } from './abstract-graph-commit';

export const CIRCLE_WIDTH = 18;
export const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH / 2;

export enum CommitCircleStyle {
    Circle,
    Rectangle
}

export class GraphCommit extends AbstractGraphCommit {

    constructor(
        public store: Store<State>,
        public x: number,
        public y: number,
        public graphPositionX: number,
        public graphPositionY: number,
        public commit: Commit,
        public style: CommitCircleStyle = CommitCircleStyle.Circle,
        public color: string = '#0AB6B9'
    ) {
        super(store);
    }

    render(svg: Svg): void {
        if (this.style === CommitCircleStyle.Circle) {
            // Outer circle
            svg
              .circle(CIRCLE_WIDTH)
              .id(`${this.commit.commitId}`)
              .fill(this.color).move(this.x, this.y)
              .on('mouseover', () => {
                this.store.dispatch(
                    GitActions.setCommitPreview(
                        {
                            commitPreview: this.commit
                        }
                    )
                );
              })
              .on('mouseover', function() {
                this.stroke({ width: 4, color: '#3BC4C7' });
              })
              .on('mouseout', function() {
                this.fill({ color: this.color});
                this.stroke({ width: 0 });
              });

            // Inner white circle
            svg.circle(INNER_CIRCLE_WIDTH)
              .fill('#ffffff')
              .attr('pointer-events', 'none')
              .move(this.x + (INNER_CIRCLE_WIDTH / 2), this.y + (INNER_CIRCLE_WIDTH / 2));
          } else if (this.style === CommitCircleStyle.Rectangle) {
            svg.rect(CIRCLE_WIDTH, CIRCLE_WIDTH).radius(5, 5).fill(this.color).move(this.x, this.y);
            svg.rect(INNER_CIRCLE_WIDTH, INNER_CIRCLE_WIDTH)
              .radius(2, 2)   // Corner radius
              .fill('#ffffff')
              .move(
                  this.x + (INNER_CIRCLE_WIDTH / 2),
                   this.y + (INNER_CIRCLE_WIDTH / 2)
                ); // Add offsets due to bounding box center position
          }
    }
}
