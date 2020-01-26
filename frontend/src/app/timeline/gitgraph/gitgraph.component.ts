import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { Commit } from 'src/app/shared/git/commit.model';
import { State } from 'src/app/reducers';
import { tap, take, withLatestFrom, map } from 'rxjs/operators';
import { GitModel } from '../../shared/git/git-model';
import { Branch } from 'src/app/shared/git/branch.model';
import { cloneDeep } from 'lodash-es';
import { COMMIT_CIRCLE_DISTANCE } from '../gitgraph/rendering/renderer';

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef;

  STROKE_WIDTH = 3;
  SVG_WIDTH = 800;
  SVG_HEIGHT = 400;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;

  constructor(private store: Store<State>) {
    this.commits$ = this.store
    .pipe(
      select(store => store.git.commits),
      map(val => [...val])
    );

    this.branches$ = this.store
    .pipe(
      select(store => store.git.branches),
      map(val => [...val])
    );

    combineLatest([this.branches$, this.commits$]).subscribe(
      (val) => {
        // Create deep copy of branches and commits
        const branches = cloneDeep(val[0]);
        const commits = cloneDeep(val[1]);

        if (branches.length > 0 && commits.length > 0) {
          this.drawGraph(branches, commits);
        }
      }
    );
  }

  ngOnInit() {
  }

  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    gitModel.rebuild();

    let svg = SVG().addTo(this.graphElement.nativeElement).size(this.SVG_WIDTH, this.SVG_HEIGHT);

    // Index of branches
    let graphBranches = 1;
    let commitGraphData: number[][];

    let x = 0;
    let y = 0;

    // Draw commit nodes originating from root nodes (Nodes without parent commmits)
    gitModel.rootCommits.forEach((commit) => {
      this.renderCommit(svg, x, y, commit);
      x++;
    });
  }

  private renderCommit(svg: Svg, x: number, y: number, commit: Commit) {
    this.renderCommitCircle(svg, x, y, commit);
    for (let i = 0; i < commit.childCommits.length; i++) {
      this.renderCommit(svg, x + 1, y + i, commit.childCommits[i]);
    }
  }

  private renderCommitCircle(svg: Svg, x: number, y: number, commit: Commit) {
    this.addCommitCircle(svg, 10 + x * COMMIT_CIRCLE_DISTANCE, 10 + y * 25, undefined, undefined, commit.commitId);
  }

  private renderGitVisualization(commits: Commit[]) {
    if (!Array.isArray(commits) || commits.length <= 0) {
      return;
    }

    const COMMIT_CIRCLE_DISTANCE = 38;

    let drawing = SVG().addTo(this.graphElement.nativeElement).size(this.SVG_WIDTH, this.SVG_HEIGHT);
    drawing.line(0, 0, 200, 0).stroke({ width: this.STROKE_WIDTH, color: '#3BC4C7', linecap: 'round'}).move(15, 20);

    for (let i = 0; i < commits.length; i++) {
      this.addCommitCircle(drawing, 10 + i * COMMIT_CIRCLE_DISTANCE, 10);
    }
    // this.addCommitCircle(drawing, 10, 10);
    // this.addCommitCircle(drawing, 50, 10);
    // this.addBranchOut(drawing, 90, 20, 120, 50);
    // this.addCommitCircle(drawing, 90, 10);

    // this.addBranchIn(drawing, 120, 50, 165, 20);
    // this.addMergeCircle(drawing, 160, 10);

    // this.addCommitCircle(drawing, 200, 10);
    // this.addCommitCircle(drawing, 120, 40, '#4D7CE8');
  }

  private addCommitCircle(
      svg: Svg,
      x: number,
      y: number,
      color: string = '#0AB6B9',
      style: CommitCircleStyle = CommitCircleStyle.Circle,
      commitID?: string
    ) {
    const CIRCLE_WIDTH = 18;
    const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH / 2;

    if (style === CommitCircleStyle.Circle) {
      // Outer circle
      svg
        .circle(CIRCLE_WIDTH)
        .id(`${commitID}`)
        .fill(color).move(x, y)
        .on('mouseover', () => {
          alert(`commit ${commitID}`);
        })
        .on('mouseover', function() {
          this.stroke({ width: 4, color: '#3BC4C7' });
        })
        .on('mouseout', function() {
          this.fill({ color: color});
          this.stroke({ width: 0 });
        });
      // Inner white circle
      svg.circle(INNER_CIRCLE_WIDTH)
        .fill('#ffffff')
        .attr('pointer-events', 'none')
        .move(x + (INNER_CIRCLE_WIDTH / 2), y + (INNER_CIRCLE_WIDTH / 2));
    } else if (style === CommitCircleStyle.Rectangle) {
      svg.rect(CIRCLE_WIDTH, CIRCLE_WIDTH).radius(5, 5).fill(color).move(x, y);
      svg.rect(INNER_CIRCLE_WIDTH, INNER_CIRCLE_WIDTH)
        .radius(2, 2)   // Corner radius
        .fill('#ffffff')
        .move(x + (INNER_CIRCLE_WIDTH / 2), y + (INNER_CIRCLE_WIDTH / 2)); // Add offsets due to bounding box center position
    }
  }

  private addMergeCircle(svg: Svg, x: number, y: number) {
    const MERGE_CIRCLE_WIDTH = 10;
    const CIRCLE_COLOR = '#0AB6B9';
    svg.circle(MERGE_CIRCLE_WIDTH).fill(CIRCLE_COLOR).move(x, y + MERGE_CIRCLE_WIDTH / 2);
  }

  private addBranchOut(svg: Svg, startX: number, startY: number, endX: number, endY: number ) {
    /**
     * Example for svg path representing L shaped arc.
     * P1               P1 -- Point of branch out (Line connecting to P2)
     * |
     * |
     * P2               P2 -- Point of curved arc begin.
     * |
     * |                P3 -- Point of curved arc end
     * L--P3------P4    P4 -- Point connecting to new branch line. (Line from P3 to P4)
     */
    // 'M 125 20 L 125 40' + // Vertical line towards arc (P1 = 125, 20) (P2 = 125, 40)
    // 'M 125 40 Q 125 50 135 50' + // L-shaped Arc from top to right (P2 = 125,40) (Q = 125,50 Quadratic bezier) (P3 = 135 50)
    // 'M 135 50 L 160 50' // Horizontal line from arc towards next commit circle (P3 = 135 50) (P4 = 160 50)
    const CIRCLE_WIDTH = 18;
    const P1_X = startX + CIRCLE_WIDTH / 2;
    const P1_Y = startY;
    const P2_Y = endY - 10;
    const P3_X = P1_X + 10;
    const P3_Y = endY;
    const P4_X = endX + CIRCLE_WIDTH / 2;
    svg.path(
      `M ${P1_X} ${P1_Y} L ${P1_X} ${P2_Y}` +
      `M ${P1_X} ${P2_Y} Q ${P1_X} ${endY} ${P3_X} ${P3_Y}` +
      `M ${P3_X} ${P3_Y} L ${P4_X} ${P3_Y}`
      ).stroke({ width: this.STROKE_WIDTH, color: '#4D7CE8' }).fill('transparent');
  }

  private addBranchIn(svg: Svg, startX: number, startY: number, endX: number, endY: number): void {
    // tslint:disable-next-line: jsdoc-format
    /**
     * Example for svg path representing inverted L shaped arc.
     *            P4    P1 -- Starting point connecting to line of branch, which should be merged in (Line connecting to P2)
     *            |     P2 -- Starting point of curved arc.
     *            |
     *           P3     P3 -- End point of curved arc.
     *            |     P4 -- Point connecting to branch in which . (Line from P3 to P4)
     *            |
     * P1----P2---
     */
    //  'M 120 50 L 155 50'
    //  'M 155 50 Q 165 50 165 40' +
    //  'M 165 20 L 165 40' +
    const CIRCLE_WIDTH = 18;
    const P1_X = startX + CIRCLE_WIDTH / 2;
    const P1_Y = startY;
    const P2_X = endX - 10;
    const P3_X = endX;
    const P3_Y = startY - 10;
    const P4_Y = endY;
    svg.path(
      `M ${P1_X} ${P1_Y} L ${P2_X} ${P1_Y}` +
      `M ${P2_X} ${P1_Y} Q ${P3_X} ${P1_Y} ${P3_X} ${P3_Y}` +
      `M ${P3_X} ${P3_Y} L ${P3_X} ${P4_Y}`
      ).stroke({ width: this.STROKE_WIDTH, color: '#4D7CE8' }).fill('transparent');
  }

}

enum CommitCircleStyle {
  Circle,
  Rectangle
}