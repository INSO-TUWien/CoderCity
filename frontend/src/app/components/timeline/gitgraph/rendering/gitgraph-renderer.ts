import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GitModel } from 'src/app/model/git-model';
import { Commit } from 'src/app/model/commit.model';
import { GraphLine } from './elements/graph-line';
import { GraphMergeCommit } from './elements/graph-merge-commit';
import { GraphCommit } from './elements/graph-commit';
import { AbstractGraphCommit } from './elements/abstract-graph-commit';
import { GitGraphGrid } from './gitgraph-grid';
import { OnGraphCommitMouseOver } from './elements/graph-commit-mouseover'

export class GitGraphRenderer {
  private renderElements: RenderElement[] = [];
  private gitModel: GitModel;

  private grid_x: number = 0;
  private grid_y: number = 0;

  // Stores which branches are active at index i of array. Used when drawing lines between commits.
  private branchChildrenIDs: Set<string> = new Set();
  private graphCommits: Map<string, AbstractGraphCommit> = new Map();
  private gitGraphGrid: GitGraphGrid = new GitGraphGrid();

  constructor(
    private svg: Svg,
    private onMouseOverCallback: OnGraphCommitMouseOver,
  ) {}

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

  private resizeSVG(): void {
    const dimensions = this.gitGraphGrid.getDimensions();
    this.svg.size(dimensions.width, dimensions.height);
  }

  private computeBranchChildren(): void {
    // Get all branch children
    this.gitModel.commitsSortedByTime.forEach((commit) => {
      // Branch children are all children of a node except the first child node.
      // Since the edge to the first child node should be drawn with a straight line)
      if (Array.isArray(commit.childCommitIDs) && commit.childCommitIDs.length > 1) {
        // // Ignore first child node, hence i = 1
        // for (let i = 1; i < commit.childCommitIDs.length; i++) {
        //   const childCommitID = commit.childCommitIDs[i];
        //   // Ignore merge commits (commits which have > 2 parents)
        //   const childCommit = this.gitModel.commits.get(childCommitID);
        //   if (childCommit.parentCommitIDs.length < 2) {
        //      // Commit is not merge commit
        //      this.branchChildrenIDs.add(childCommitID);
        //    }
        // }

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


  private createCommitCircle(commit: Commit): void {
    // Get active branches snapshot of current commit
    const activeBranches = this.gitGraphGrid.getActiveBranches(
      (this.grid_x === 0) ? 0 : this.grid_x - 1
    );

    console.debug(`Drawing commit: ${commit.message} sha: ${commit.commitId}. \n Occupied Branches: ${JSON.stringify(activeBranches)}`);

    // Check whether a commit can replace a commit in the active branches array
    const activeBranchReplacement = this.gitGraphGrid.getReplacementInActiveBranches(commit, activeBranches);

    if (
      activeBranchReplacement.length === 0
      || this.branchChildrenIDs.has(commit.commitId)
    ) {
      // No replacement for an existing active branch could be found.
      // Or commit is a branch children which branches out from the parent node.
      console.debug(`No replacement found`);
      // The commit can not replace an existing commit in the active branches array.
      // Find an empty slot in the active branches array or create a new branch (append commit to the active branches array).
      const emptySlot = this.gitGraphGrid.getEmptySlotInActiveBranches(commit, activeBranches);
      let validPlacement = false;
      if (emptySlot !== -1) {
        // Check whether empty slot is valid (does not overlap with other commits)
        validPlacement = commit.parentCommitIDs.map((parentCommitID) => {
          const parentCommit = this.graphCommits.get(parentCommitID);
          return this.gitGraphGrid.isValidBranchPath(parentCommit, this.grid_x, emptySlot);
        }).reduce((prev, cur) => prev && cur, true);
      }

      if (emptySlot !== -1 && validPlacement === true) {
        this.grid_y = emptySlot;
      } else {
        this.grid_y = (this.grid_x === 0) ? 0 : this.grid_y + 1;
      }
    } else {
      this.grid_y = activeBranchReplacement[0];
      console.debug(`Commit ${commit.message} sha: ${commit.commitId} replaces ${activeBranches[activeBranchReplacement[0]]}`);
    }

    this.createCommit(this.grid_x, this.grid_y, commit);

    // Update occupiedBranches array which tracks active branches.
    if (commit.childCommitIDs.length === 0) {
      // If commit has no children, then the branch ends here. Remove the current branch from active branches array.
      activeBranches[this.grid_y] = null;
    } else {
      // Branch is still active Set current commit in active branches array.
      activeBranches[this.grid_y] = commit.commitId;
    }

    // Update active branches.
    this.gitGraphGrid.setActiveBranches(this.grid_x, activeBranches);
    this.grid_x++;
  }

  private createLines(): void {
    this.gitModel.commitsSortedByTime.forEach((commit) => {
      commit.childCommitIDs.forEach((childCommitID) => {
        // Create lines to all child commits.
        const startElement = this.graphCommits.get(commit.commitId);
        const endElement = this.graphCommits.get(childCommitID);
        const line = new GraphLine(startElement, endElement);
        this.addElement(line);
      });
    });
  }

  // private createLinesO(): void {
  //   // Traverse all child commit nodes and draw lines between parent and child commit
  //   this.gitModel.rootCommits.forEach((rootCommitId) => {
  //     const rootCommit = this.gitModel.getCommit(rootCommitId);
  //     this.createLineBetweenCommits(rootCommit.commitId);
  //   });
  // }

  // private createLineBetweenCommits(commitId: string) {
  //   console.log(`createLineBetweenCommits ${commitId}`);
  //   const commit = this.gitModel.getCommit(commitId);
  //   if (commit == null) {
  //     return;
  //   }
  //   commit.childCommitIDs.forEach((childCommitID) => {
  //     const startElement = this.graphCommits.get(commit.commitId);
  //     const endElement = this.graphCommits.get(childCommitID);
  //     const line = new GraphLine(startElement, endElement);
  //     this.addElement(line);
  //     this.createLineBetweenCommits(childCommitID);
  //   });
  // }

  private createCommit(
    x: number,
    y: number,
    commit: Commit
  ) {
    // Render commit circle or merge commit circle if commit has more than 1 parents
    const graphCommit =
      commit.parentCommitIDs.length >= 2
        ? this.renderCommitMergeCircle(x, y, commit)
        : this.renderCommitCircle(x, y, commit);

    this.graphCommits.set(graphCommit.commit.commitId, graphCommit);
  }

  private renderCommitMergeCircle(
    x: number,
    y: number,
    commit: Commit
  ): GraphMergeCommit {
    const commitCircle = new GraphMergeCommit(
      this.onMouseOverCallback,
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
      this.onMouseOverCallback,
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
    this.resizeSVG();
    this.renderElements.forEach(e => e.render(this.svg));
  }
}
