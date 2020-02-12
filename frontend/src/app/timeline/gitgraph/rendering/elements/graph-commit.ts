import { Commit } from "src/app/shared/git/commit.model";
import { Svg } from "@svgdotjs/svg.js";
import { State } from "src/app/reducers";
import * as GitActions from "../../git.action";
import { Store } from "@ngrx/store";
import { AbstractGraphCommit } from "./abstract-graph-commit";
import { getBranchColor, getBranchHighlightColor } from "../graph-colors";
import { GridPosition, computeCommitCirclePosition } from "../compute-position";

export const CIRCLE_WIDTH = 18;
export const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH / 2;

export class GraphCommit extends AbstractGraphCommit {
  private highlightColor: string;

  constructor(
    public store: Store<State>,
    public readonly gridPosition: GridPosition,
    public commit: Commit,
    public color: string = "#0AB6B9"
  ) {
    super(store);
    this.color = getBranchColor(this.gridPosition.y);
    this.highlightColor = getBranchHighlightColor(this.gridPosition.y);
    const pixelCoordinates = computeCommitCirclePosition({
      x: gridPosition.x,
      y: gridPosition.y
    });
    this.x = pixelCoordinates.x;
    this.y = pixelCoordinates.y;
    this.graphPositionX = this.gridPosition.x;
    this.graphPositionY = this.gridPosition.y;
  }

  render(svg: Svg): void {
    // Outer circle
    const circle = svg
      .circle(CIRCLE_WIDTH)
      .id(`${this.commit.commitId}`)
      .fill(this.color)
      .move(this.x, this.y)
      .on("mouseover", () => {
        this.store.dispatch(
          GitActions.setCommitPreview({
            commitPreview: this.commit
          })
        );
        circle.stroke({ width: 4, color: this.highlightColor });
      })
      .on("mouseout", () => {
        circle.fill({ color: this.color }).stroke({ width: 0 });
      });

    // Inner white circle
    svg
      .circle(INNER_CIRCLE_WIDTH)
      .fill("#ffffff")
      .attr("pointer-events", "none")
      .move(this.x + INNER_CIRCLE_WIDTH / 2, this.y + INNER_CIRCLE_WIDTH / 2);
  }
}
