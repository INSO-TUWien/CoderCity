import { RenderElement } from "./render-element";
import { Svg } from "@svgdotjs/svg.js";
import { GitModel } from "src/app/shared/git/git-model";
import { Store } from "@ngrx/store";
import { State } from "src/app/reducers";
import { Commit } from "src/app/shared/git/commit.model";
import { GraphRoundedLine } from "./elements/graph-rounded-line";
import { GraphMergeCommit } from "./elements/graph-merge-commit";
import { GraphCommit } from "./elements/graph-commit";

export const COMMIT_CIRCLE_DISTANCE = 38;

export class GitGraphRenderer {
  private renderElements: RenderElement[] = [];
  private gitModel: GitModel;

  private g_x: number = 0;
  private g_y: number = 0;

  private graphCommits: Map<string, RenderElement> = new Map();

  constructor(private svg: Svg, private store: Store<State>) {}

  private addElement(element: RenderElement) {
    this.renderElements.push(element);
  }

  private clear() {
    // TODO Fix clear function
    this.renderElements = [];
    this.svg.clear();
  }

  renderGitModel(gitModel: GitModel) {
    this.clear();
    this.gitModel = gitModel;
    this.drawGraph();
  }

  private drawGraph(): void {
    this.gitModel.commits.forEach((commit) => {
      this.createCommit(this.svg, this.g_x, this.g_y, commit);
      this.g_x++;
      // Do not advance y coordinate in case there is only one child Commit (straight line)
      if (commit.childCommits.length !== 1) {
        this.g_y++;
      }
    });

    // Traverse all child commit nodes and draw lines between parent and child commit
    this.gitModel.rootCommits.forEach((rootCommitId) => {
      const rootCommit = this.gitModel.getCommit(rootCommitId);
      this.createCommitLine(rootCommit.commitId);
    });

    this.render();
  }

  private createCommitLine(commitId: string) {
    const commit = this.gitModel.getCommit(commitId);
    commit.childCommits.forEach((childCommit) => {
      const startElement = this.graphCommits.get(commit.commitId);
      const endElement = this.graphCommits.get(childCommit.commitId);
      const line = new GraphRoundedLine(startElement, endElement);
      this.addElement(line);
      this.createCommitLine(childCommit.commitId);
    });
  }

  private createCommit(
    svg: Svg,
    x: number,
    y: number,
    commit: Commit
  ) {
    // Render commit circle or merge commit circle if commit has more than 1 parents
    const graphCommit =
      commit.parentCommits.length >= 2
        ? this.renderCommitMergeCircle(svg, x, y, commit)
        : this.renderCommitCircle(svg, x, y, commit);

    this.graphCommits.set(graphCommit.commit.commitId, graphCommit);
  }

  private renderCommitMergeCircle(
    svg: Svg,
    x: number,
    y: number,
    commit: Commit
  ): GraphMergeCommit {
    const circleX = 10 + x * COMMIT_CIRCLE_DISTANCE;
    const circleY = 10 + y * 25;

    const commitCircle = new GraphMergeCommit(
      this.store,
      circleX,
      circleY,
      commit,
      undefined
    );
    this.addElement(commitCircle);
    return commitCircle;
  }

  private renderCommitCircle(
    svg: Svg,
    x: number,
    y: number,
    commit: Commit
  ): GraphCommit {
    const circleX = 10 + x * COMMIT_CIRCLE_DISTANCE;
    const circleY = 10 + y * 25;

    const commitCircle = new GraphCommit(
      this.store,
      circleX,
      circleY,
      commit,
      undefined,
      undefined
    );
    this.addElement(commitCircle);
    return commitCircle;
  }

  render(): void {
    this.renderElements.forEach(e => e.render(this.svg));
  }
}
