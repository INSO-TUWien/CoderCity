import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GitModel } from 'src/app/shared/git/git-model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Commit } from 'src/app/shared/git/commit.model';
import { GraphLine } from './elements/graph-line';
import { GraphMergeCommit } from './elements/graph-merge-commit';
import { GraphCommit } from './elements/graph-commit';
import { AbstractGraphCommit } from './elements/abstract-graph-commit';
import { COMMIT_CIRCLE_DISTANCE } from './gitgraph-constants';
import { computeDimensions } from './compute-position';

export class GitGraphRenderer {
  private renderElements: RenderElement[] = [];
  private gitModel: GitModel;

  private grid_x: number = 0;
  private grid_y: number = 0;

  // Stores which branches are active at index i of array. Used when drawing lines between commits.
  private occupiedBranches: string[][] = [];
  private branchChildrenIDs: Set<string> = new Set();
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

  private resizeSVG(commitsCount: number, branchesCount: number): void {
    const dimensions = computeDimensions(commitsCount, branchesCount);
    this.svg.size(dimensions.width, dimensions.height);
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
    if (startElement == null || endX < 0 || endY < 0) {
      console.warn(`isValidBranchPath: Received invalid values as parameters.`);
      return false;
    }
    // Use x coordinate of start element as starting point
    const startX = startElement.graphPositionX;
    // Traverse through all elements up until endElement is reached. If the graph contains other elements the path is not valid.
    for (let x = startX; x < endX; x++) {
      if (this.isOccupied(x, endY)) {
        return false;
      }
    }
    return true;
  }

  private computeBranchChildren(): void {
    // Get all branch children
    this.gitModel.commitsSortedByTime.forEach((commit) => {
      // TODO: OPTIMIZATION: Branches may be visited multiple times.
      // Branch children are all children of a node except the first child node.
      // Since the edge to the first child node should be drawn with a straight line)
      if (Array.isArray(commit.childCommitIDs) && commit.childCommitIDs.length > 1) {
        commit.childCommitIDs.forEach((childCommitID) => {
          // Ignore merge commits (commits which have > 2 parents)
          const childCommit = this.gitModel.commits.get(childCommitID);
          if (childCommit.parentCommitIDs.length < 2) {
            // Commit is not merge commit
            this.branchChildrenIDs.add(childCommitID);
          }
        });
      }
    });
  }

  private createCommitCircles(): void {
    this.computeBranchChildren();
    this.gitModel.commitsSortedByTime.forEach((commit) => {
      this.createCommitCircle(commit);
    });
  }

  /**
   * Computes eligible replacements/successors to commits stored in the active branches.
   */
  private getReplacementInActiveBranches(commit: Commit, activeBranches: string[]): number[] {
    // For all parent ids of the commit, check if a parent is in the active branches array.
    const replacements = [];
    commit.parentCommitIDs.forEach((parentId) => {
      const replacement = activeBranches.findIndex((c) => c === parentId);
      if (replacement !== -1) {
        replacements.push(replacement);
      }
    });
    return replacements;
  }

  /**
   * Retrieves the next empty slot available in the active branches array.
   * @param commit
   * @param activeBranches
   */
  private getEmptySlotInActiveBranches(commit: Commit, activeBranches: string[]): number {
    const emptySlotIndex = activeBranches.findIndex((val) => val === null);
    return emptySlotIndex;
  }

  private createCommitCircle(commit: Commit): void {
    // Get occupied branches array of current commit
    const occupiedBranchesSnapshot = this.getOccupiedBranches(
      (this.grid_x === 0) ? 0 : this.grid_x - 1);

    console.debug(`Drawing commit: ${commit.message} sha: ${commit.commitId}. \n Occupied Branches: ${JSON.stringify(occupiedBranchesSnapshot)}`);

    // Check whether a commit can replace a commit in the active branches array
    const activeBranchReplacement = this.getReplacementInActiveBranches(commit, occupiedBranchesSnapshot);

    if (
      activeBranchReplacement.length === 0
      || this.branchChildrenIDs.has(commit.commitId)) {
      // No replacement for an existing active branch could be found.
      // Or commit is a branch children which branches out from the parent node.
      console.debug(`No replacement found`);
      // The commit can not replace an existing commit in the active branches array.
      // Find an empty slot in the active branches array or append the commit to the array as a new branch.
      const emptySlot = this.getEmptySlotInActiveBranches(commit, occupiedBranchesSnapshot);
      let validPlacement = false;
      if (emptySlot !== -1) {
        // Check whether empty slot is valid (does not overlap with other commits)
        validPlacement = commit.parentCommitIDs.map((parentCommitID) => {
          const parentCommit = this.graphCommits.get(parentCommitID);
          return this.isValidBranchPath(parentCommit, this.grid_x, emptySlot);
        }).reduce((prev, cur) => prev && cur, true);
      }

      if (emptySlot !== -1 && validPlacement === true) {
        this.grid_y = emptySlot;
      } else {
        this.grid_y = (this.grid_x === 0) ? 0 : this.grid_y + 1;
      }
    } else {
      this.grid_y = activeBranchReplacement[0];
      console.debug(`Commit ${commit.message} sha: ${commit.commitId} replaces ${occupiedBranchesSnapshot[activeBranchReplacement[0]]}`);
    }

    this.createCommit(this.grid_x, this.grid_y, commit);

    // Update occupiedBranches array which tracks active branches.
    if (commit.childCommitIDs.length === 0) {
      // If commit has no children, then the branch ends here. Release/Remove the current branch from active branches array.
      occupiedBranchesSnapshot[this.grid_y] = null;
    } else {
      // Set current commit in occupied branches array where all active branches are tracked.
      occupiedBranchesSnapshot[this.grid_y] = commit.commitId;
    }

    // Update active branches.
    this.setOccupiedBranches(this.grid_x, occupiedBranchesSnapshot);
    this.grid_x++;
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
      const line = new GraphLine(startElement, endElement);
      this.addElement(line);
      this.createCommitLine(childCommitID);
    });
  }

  private createCommit(
    x: number,
    y: number,
    commit: Commit
  ) {
    // Render commit circle or merge commit circle if commit has more than 1 parents
    const graphCommit =
      commit.parentCommitIDs.length >= 2
        ? this.createCommitMergeCircle(x, y, commit)
        : this.renderCommitCircle(x, y, commit);

    this.graphCommits.set(graphCommit.commit.commitId, graphCommit);
  }

  private createCommitMergeCircle(
    x: number,
    y: number,
    commit: Commit
  ): GraphMergeCommit {
    const commitCircle = new GraphMergeCommit(
      this.store,
      {
        x,
        y
      },
      commit,
      undefined
    );
    this.addElement(commitCircle);
    return commitCircle;
  }

  private renderCommitCircle(
    x: number,
    y: number,
    commit: Commit
  ): GraphCommit {
    const commitCircle = new GraphCommit(
      this.store,
      {
        x,
        y
      },
      commit,
      undefined
    );
    this.addElement(commitCircle);
    return commitCircle;
  }

  render(): void {
    this.renderElements.forEach(e => e.render(this.svg));
  }
}
