import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GitModel } from 'src/app/model/git-model';
import { Commit } from 'src/app/model/commit.model';
import { GraphLine } from './elements/graph-line';
import { GraphMergeCommit } from './elements/graph-merge-commit';
import { GraphCommit } from './elements/graph-commit';
import { AbstractGraphCommit } from './elements/abstract-graph-commit';
import { GitGraphGrid } from './gitgraph-grid';
import { OnGraphCommitMouseOver, OnGraphCommitClick, GitGraphCallbacks } from './callback/callback';

/**
 * Checks whether given commit is a merge commit. (Has 2 or more parent commits)
 */
export function isMergeCommit(commit: Commit): boolean {
    if (commit.parentCommitIDs.length >= 2) {
      return true;
    } else {
      return false;
    }
}

export class GitGraphRenderer {

  constructor(
    private svg: Svg,
    private callbacks: GitGraphCallbacks
  ) {}
  private renderElements: RenderElement[] = [];
  private gitModel: GitModel;

  private grid_x: number = 0;
  private grid_y: number = 0;

  // Stores which branches are active at index i of array. Used when drawing lines between commits.
  private branchChildrenIDs: Set<string> = new Set();
  private graphCommits: Map<string, AbstractGraphCommit> = new Map();
  private gitGraphGrid: GitGraphGrid = new GitGraphGrid();

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
      if (Array.isArray(commit.childCommitIDs) && commit.childCommitIDs.length > 1) {
        commit.childCommitIDs.forEach((childCommitID) => {
          // Ignore merge commits (commits which have > 2 parents)
          const childCommit = this.gitModel.commits.get(childCommitID);
          if (!Commit.isMergeCommit(childCommit)) {
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

  private forbiddenPaths: Set<[number, string]> = new Set();

  private isForbiddenPath(gridY: number) {
    for (let path of this.forbiddenPaths) {
      if (gridY === path[0]) {
        return true;
      }
    }
    return false;
  }

  private createCommitCircle(commit: Commit): void {
    // Get active branches snapshot of current commit
    const activeBranches = this.gitGraphGrid.getActiveBranches(
      (this.grid_x === 0) ? 0 : this.grid_x - 1
    );
    console.debug(`----------\n`);
    console.debug(`Drawing commit: ${commit.message} \nsha: ${commit.commitId}. \n Active Branches: ${JSON.stringify(activeBranches)}`);
    console.debug(`Forbidden paths: \n`);
    this.forbiddenPaths.forEach((f) => console.debug(`[${f}],`));
    // Check whether a commit can replace a commit in the active branches array
    const activeBranchReplacement = this.gitGraphGrid.getReplacementInActiveBranches(commit, activeBranches);
    const isForbidden = this.isForbiddenPath(activeBranchReplacement[0]);
    if (activeBranchReplacement.length >= 1 && isForbidden === false) {
      this.grid_y = activeBranchReplacement[0];
      console.warn(`Commit ${commit.message} sha: ${commit.commitId} replaces ${activeBranches[activeBranchReplacement[0]]}`);
    } else if (
      activeBranchReplacement.length === 0
      || this.branchChildrenIDs.has(commit.commitId)
    ) {
      // No replacement for an existing active branch could be found.
      // Or commit is a branch children which branches out from the parent node.
      this.placeInEmptyOrCreateSlot(commit, activeBranches);
    } else if (Commit.isMergeCommit(commit)) {
      // Delete all forbidden paths associated for this commit.
      this.forbiddenPaths.forEach((value) => {
        if (value[1] === commit.commitId) {
          this.forbiddenPaths.delete(value);
        }
      });
      // Replace as a merge commit
      let selectedSlot = activeBranchReplacement.find((value) => (!this.isForbiddenPath(value)));
      if (selectedSlot !== undefined) {
        this.grid_y = selectedSlot;
        console.error(`MergeCommit ${commit.message} sha: ${commit.commitId} replaces ${activeBranches[activeBranchReplacement[0]]}`);
      } else {
        this.placeInEmptyOrCreateSlot(commit, activeBranches);
      }
    }

    this.createCommit(this.grid_x, this.grid_y, commit);
    this.updateActiveBranches(commit, this.grid_y, activeBranches);
    this.addForbiddenPathsForMergeChildren(commit, this.grid_x, this.grid_y);
    this.grid_x++;
  }

  private placeInEmptyOrCreateSlot(commit: Commit, activeBranches: string[]) {
    console.debug(`No replacement found`);
    // The commit can not replace an existing commit in the active branches array.
    // Find an empty slot in the active branches array or create a new branch (append commit to the active branches array).
    const emptySlots = this.gitGraphGrid.getEmptySlotsInActiveBranches(activeBranches);
    let validSlots = [];
    if (emptySlots.length > 0) {
      // Check whether empty slot is valid (does not overlap with other commits)
      validSlots = emptySlots.filter((slot) => this.isValidPlacement(commit, slot));
    }

    if (validSlots.length > 0) {
      this.grid_y = validSlots[0];
    } else {
      // Absolutely no free slot is available. Append in new slot.
      this.grid_y = (this.grid_x === 0) ? 0 : activeBranches.length;
    }
  }

  /**
   * Check whether placement of the comit in the slotIndex is valid.
   * Checks for both merge path reservations and collisions with other placed commits.
   */
  private isValidPlacement(commit, slotIndex: number): boolean {
    // Check whether empty slot is valid (does not overlap with other commits)
    const valid = commit.parentCommitIDs.map((parentCommitID) => {
      const parentCommit = this.graphCommits.get(parentCommitID);
      return this.gitGraphGrid.isValidBranchPath(parentCommit, this.grid_x, slotIndex) && !this.isForbiddenPath(slotIndex);
    }).reduce((prev, cur) => prev && cur, true);
    return valid;
  }

  private getBranchChildrenCount(commit: Commit): number {
    let count = 0;
    commit.childCommitIDs.forEach(childCommitId => {
      const childCommit = this.gitModel.getCommit(childCommitId);
      if (!Commit.isMergeCommit(childCommit)) {
        count++;
      }
    });
    return count;
  }

  private areAllBranchChildrenBeforeDate(commit: Commit, date: Date): boolean {
    let result = true;
    for (let childCommitId of commit.childCommitIDs) {
      const childCommit = this.gitModel.getCommit(childCommitId);
      if (!Commit.isMergeCommit(childCommit)) {
        if (childCommit.date >= date) {
          result = false;
        }
      }
    }
    return result;
  }

  private addForbiddenPathsForMergeChildren(commit: Commit, grid_x: number, grid_y: number) {
    commit.childCommitIDs.forEach((childCommitId) => {
      const childCommit = this.gitModel.getCommit(childCommitId);
      if (Commit.isMergeCommit(childCommit)) {
        const mergeChildX = this.gitModel.commitsSortedByTime.findIndex((c) => c.commitId === childCommit.commitId);
        this.forbiddenPaths.add([grid_y, childCommit.commitId]);
      }
    });
  }

  private updateActiveBranches(commit: Commit, grid_y: number, activeBranches: string[]) {
    // Update occupiedBranches array which tracks active branches.
    if (commit.childCommitIDs.length === 0) {
      // If commit has no children, then the branch ends here. Remove the current branch from active branches array.
      activeBranches[grid_y] = null;
    } else {
      // Branch is still active. Set current commit in active branches array.
      activeBranches[grid_y] = commit.commitId;

      // Check whether the current commit is a merge commit.
      // If so check if the slot of one of the parent commits can be released.
      // A slot can be released if the parent commit is not aligned straightly to the current commit.
      // Also the parent commit must not have any succeeding commits except the current commit.
      if (isMergeCommit(commit)) {
        let candidates: [string, AbstractGraphCommit][] = [];
        // Find eligible candidates. Parent commits which are not aligned with the current commit
        commit.parentCommitIDs.forEach((parentCommitID) => {
          const parentCommit = this.graphCommits.get(parentCommitID);
          if (parentCommit.graphPositionY !== grid_y) {
            candidates.push([parentCommitID, parentCommit]);
          }
        });

        candidates.forEach((candidateCommit) => {
          const parentCommit = this.gitModel.commits.get(candidateCommit[0]);
          if (parentCommit.childCommitIDs.length <= 1) {
            // Incoming commit has no other child commits. The incoming commit branch completely merges into different commit branch.
            // Release slot of the parent commit
            activeBranches[candidateCommit[1].graphPositionY] = null;
          } else if (this.getBranchChildrenCount(parentCommit) === 0 && !this.isForbiddenPath(candidateCommit[1].graphPositionY)) {
            // Release slot if there are no sucessor nodes and all merge commits are already merged. ( no fobidden paths)
            activeBranches[candidateCommit[1].graphPositionY] = null;
          } else if (this.getBranchChildrenCount(parentCommit) >= 1 && this.areAllBranchChildrenBeforeDate(parentCommit, commit.date)) {
            //
            activeBranches[candidateCommit[1].graphPositionY] = null;
          }
        });
      }
    }

    // Update active branches.
    this.gitGraphGrid.setActiveBranches(this.grid_x, activeBranches);
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
      this.callbacks,
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
      this.callbacks,
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
