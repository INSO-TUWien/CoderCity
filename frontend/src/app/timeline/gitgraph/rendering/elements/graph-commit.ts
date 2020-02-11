import { Commit } from 'src/app/shared/git/commit.model';
import { Svg } from '@svgdotjs/svg.js';
import { State } from 'src/app/reducers';
import * as GitActions from '../../git.action';
import { Store } from '@ngrx/store';
import { AbstractGraphCommit } from './abstract-graph-commit';
import { getBranchColor, getBranchHighlightColor } from '../graph-colors';

export const CIRCLE_WIDTH = 18;
export const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH / 2;

export enum CommitCircleStyle {
    Circle,
    Rectangle
}

export class GraphCommit extends AbstractGraphCommit {
  private highlightColor: string;

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
        this.color = getBranchColor(this.graphPositionY);
        this.highlightColor = getBranchHighlightColor(this.graphPositionY);
    }

    render(svg: Svg): void {
        if (this.style === CommitCircleStyle.Circle) {
            // Outer circle
            const circle = svg
              .circle(CIRCLE_WIDTH)
              .id(`${this.commit.commitId}`)
              .fill(
                this.color
              )
              .move(this.x, this.y)
              .on('mouseover', () => {
                this.store.dispatch(
                    GitActions.setCommitPreview(
                        {
                            commitPreview: this.commit
                        }
                    )
                );
                circle.stroke({ width: 4, color: this.highlightColor });
              })
              .on('mouseout', () => {
                circle
                  .fill({ color: this.color})
                  .stroke({ width: 0 });
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
