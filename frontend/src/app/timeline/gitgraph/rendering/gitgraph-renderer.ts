import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GitModel } from 'src/app/shared/git/git-model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Commit } from 'src/app/shared/git/commit.model';
import { GraphRoundedLine } from './elements/graph-rounded-line';
import { GraphMergeCommit } from './elements/graph-merge-commit';
import { GraphCommit } from './elements/graph-commit';
import { AbstractGraphCommit } from './elements/abstract-graph-commit';

export const COMMIT_CIRCLE_DISTANCE = 38;

export class GitGraphRenderer {
  private renderElements: RenderElement[] = [];
  private gitModel: GitModel;

  private g_x: number = 0;
  private g_y: number = 0;

  // Stores which branches are active at index i of array. Used when drawing lines between commits.
  private occupiedBranches: string[][] = [];
  private graphCommits: Map<string, AbstractGraphCommit> = new Map();

  constructor(private svg: Svg, private store: Store<State>) {}

  private addElement(element: RenderElement) {
    this.renderElements.push(element);
  }

  /**
   * Clears and empties the current svg element.
   */
  clear() {
    // TODO Fix clear function
    this.renderElements = [];
    this.svg.clear();
  }

  drawGraph(gitModel: GitModel) {
    this.clear();
    this.gitModel = gitModel;
    this.createCommitCircles();
    this.createLines();
    this.render();
  }

  private getOccupiedBranches(x: number): string[] {
    return Object.assign([], this.occupiedBranches[x]);
  }

  private setOccupiedBranches(x: number, occupiedBranches: string[]): void {
    this.occupiedBranches[x] = occupiedBranches;
  }

  /**
   * Checks whether branch is set in the occupiedBranches array.
   */
  private isOccupied(x: number, y: number): boolean {
    const occupiedBranches = this.getOccupiedBranches(x);
    const element = occupiedBranches[y];
    return (element !== null) ? true : false;
  }

  private isValidBranchPath(startElement: AbstractGraphCommit, endX: number, endY: number): boolean {
    // Use x coordinate of start element as starting point
    const startX = startElement.x;
    // Traverse through all elements up until endElement is reached. If the graph contains other elements the path is not valid.
    for (let x = startX; x < endX; x++) {
      if (this.isOccupied(x, endY)) {
        return false;
      }
    }
    return true;
  }


  private createCommitCircles(): void {

    // Get all branch children
    const commits = Array.from<Commit>(this.gitModel.commits.values());
    const branchChildren = commits.filter((commit) => {
      if (Array.isArray(commit.parentCommitIDs) && commit.parentCommitIDs.length > 0) {
        const val = commit.parentCommitIDs![0] === commit.commitId;
        return val;
      } else {
        return false;
      }
    });

    this.gitModel.commits.forEach((commit) => {
      this.createCommitCircle(commit);
    });
  }

  private createCommitCircle(commit: Commit): void {
    // Get occupied branches array of current commit
    const occupiedBranchesSnapshot = this.getOccupiedBranches(
      (this.g_x === 0) ? 0 : this.g_x - 1);

    console.debug(`Drawing commit: ${commit.message} sha: ${commit.commitId}. \n Occupied Branches: ${JSON.stringify(occupiedBranchesSnapshot)}`);

    // Check whether a commit can replace a commit in the active branches array
    let occupiedBranchReplacement = -1;
    // For all parent ids of the commit, check if a parent is in the active branches array.
    commit.parentCommitIDs.forEach((parentId) => {
      occupiedBranchReplacement = occupiedBranchesSnapshot.findIndex((c) => c === parentId);
    });
    if (occupiedBranchReplacement === null || occupiedBranchReplacement === -1) {
      console.debug(`No replacement found`);
      this.g_y = (this.g_x === 0) ? 0 : this.g_y + 1;
    } else {
      this.g_y = occupiedBranchReplacement;
      console.debug(`Commit ${commit.message} sha: ${commit.commitId} replaces ${occupiedBranchesSnapshot[occupiedBranchReplacement]}`);
    }

    this.createCommit(this.svg, this.g_x, this.g_y, commit);

    // Update occupiedBranches array which tracks active branches.
    if (commit.childCommitIDs.length === 0) {
      // If commit has no children, then the branch ends here. Release/Remove the current branch from active branches array.
      occupiedBranchesSnapshot[this.g_y] = null;
    } else {
      // Set current commit in occupied branches array where all active branches are tracked.
      occupiedBranchesSnapshot[this.g_y] = commit.commitId;
    }

    // Update active branches.
    this.setOccupiedBranches(this.g_x, occupiedBranchesSnapshot);
    this.g_x++;
  }

  private createLines(): void {
    // Traverse all child commit nodes and draw lines between parent and child commit
    this.gitModel.rootCommits.forEach((rootCommitId) => {
      const rootCommit = this.gitModel.getCommit(rootCommitId);
      this.createCommitLine(rootCommit.commitId);
    });
  }

  private createCommitLine(commitId: string) {
    const commit = this.gitModel.getCommit(commitId);
    commit.childCommitIDs.forEach((childCommitID) => {
      const startElement = this.graphCommits.get(commit.commitId);
      const endElement = this.graphCommits.get(childCommitID);
      const line = new GraphRoundedLine(startElement, endElement);
      this.addElement(line);
      this.createCommitLine(childCommitID);
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
      commit.parentCommitIDs.length >= 2
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
      x,
      y,
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
      x,
      y,
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
