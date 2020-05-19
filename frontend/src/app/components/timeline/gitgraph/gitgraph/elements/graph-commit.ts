import { Commit } from "src/app/model/commit.model";
import { Svg } from "@svgdotjs/svg.js";
import { AbstractGraphCommit, GraphCommitState} from "./abstract-graph-commit";
import { getBranchColor, getBranchHighlightColor } from "../graph-colors";
import { GridPosition, computeCommitCirclePosition } from "../compute-position";
import { GitGraphCallbacks } from '../callback/callback';

export const CIRCLE_WIDTH = 18;
export const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH / 2;

export class GraphCommit extends AbstractGraphCommit {
  private highlightColor: string;
  state: GraphCommitState = GraphCommitState.Default;

  constructor(
    public callbacks: GitGraphCallbacks,
    public readonly gridPosition: GridPosition,
    public commit: Commit,
    public color: string = "#0AB6B9"
  ) {
    super(callbacks, commit);
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

  setState(state: GraphCommitState) {
    if (state === GraphCommitState.Default) {
      this.shape.fill({ color: this.color }).stroke({ width: 0 });
      this.state = state;
    } else if (state === GraphCommitState.Selected) {
      this.shape.stroke({ width: 4, color: this.highlightColor });
      this.state = state;
    } else if (state === GraphCommitState.Highlight) {
      // Do not persist state for highlight state. (Hover state).
      this.shape.stroke({ width: 4, color: this.highlightColor });
    }
  }

  render(svg: Svg): void {
    // Outer circle
    this.shape = svg
      .circle(CIRCLE_WIDTH)
      .addClass('gitgraph-commit')
      .id(`${this.commit.commitId}`)
      .fill(this.color)
      .move(this.x, this.y)
      .on("mouseover", () => {
       this.setState(GraphCommitState.Highlight);
       this.callbacks?.onGraphCommitMouseOver(this.commit);
      })
      .on("click", () => {
        this.callbacks?.onGraphCommitClick(this.commit);
      })
      .on("mouseout", () => {
        this.setState(this.state);
        this.callbacks?.onGraphCommitMouseOut(this.commit);
      });

    // Inner white circle
    svg
      .circle(INNER_CIRCLE_WIDTH)
      .fill("#ffffff")
      .attr("pointer-events", "none")
      .move(this.x + INNER_CIRCLE_WIDTH / 2, this.y + INNER_CIRCLE_WIDTH / 2);
  }
}
