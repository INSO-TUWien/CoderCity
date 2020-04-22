import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { Commit } from 'src/app/model/commit.model';
import { map } from 'rxjs/operators';
import { GitModel } from '../../../model/git-model';
import { Branch } from 'src/app/model/branch.model';
import { cloneDeep } from 'lodash-es';
import { GitGraphRenderer } from './rendering/gitgraph-renderer';
import { GitgraphService } from './gitgraph.service';
import { CommitService } from 'src/app/services/commit.service';
import { GitQuery } from 'src/app/state/git.query';
import { VisualizationService } from 'src/app/services/visualization.service';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { GraphCommitState } from './rendering/elements/abstract-graph-commit';
import { TooltipComponent, TooltipState, TooltipMenuItemSelected, TooltipMenuItem } from './tooltip/tooltip.component';
import { CommitTimeInterval } from '../commit-timeinterval';
import { Util } from './rendering/util/util';

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  private selectedLineKeys: string[];

  constructor(
    private commitService: CommitService,
    private gitQuery: GitQuery,
    private gitGraphService: GitgraphService,
    private visualizationQuery: VisualizationQuery,
    private visualizationService: VisualizationService
    ) {
    // Retrieve commits and sort them by time. (Oldest first)
    this.commits$ = this.gitQuery.sortedCommits$;
    this.commitsMap$ = this.gitQuery.commitsMap$;
    this.branches$ = this.gitQuery.branches$.pipe( map(val => [...val]));
    this.selectedCommitInterval$ = this.visualizationQuery.selectedCommitInterval$;

    // Set selected commit to 'selected' state
    this.visualizationSubscription = this.visualizationQuery.selectedCommit$.subscribe(
      (selectedCommit) => {
        // Deselect previous selected commit if existing
        this.deselectSelectedCommit();
        if (selectedCommit != null) {
          this.renderer.setGraphCommitState(selectedCommit.commitId, GraphCommitState.Selected);
          this.selectedCommit = selectedCommit;
        }
    });

    /**
     * Handle commit graph interval selection
     */
    combineLatest([this.commitsMap$, this.selectedCommitInterval$]).subscribe(
      ([commits, interval]) => {

        if (this.selectedLineKeys != null) {
          // Reset prior interval selection if exists
          this.selectedLineKeys.forEach((lineKey) => {
            this.renderer.setGraphLineState(lineKey, GraphCommitState.Default);
          });
        }

        if (
          commits != null &&
          commits.size > 0 &&
          interval != null &&
          interval.start != null && interval.end != null) {
                const result = Util.getCommitsBetweenAsLineIds(interval.end.commitId, interval.start.commitId, commits);

                result.lineCommitKeys.forEach((lineKey) => {
                  this.renderer.setGraphLineState(lineKey, GraphCommitState.Selected);
                });
                this.selectedLineKeys = result.lineCommitKeys;
        }
      }
    );

    this.branchesCommitSubscription = combineLatest([this.branches$, this.commits$]).subscribe(
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

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef<HTMLElement>;

  @ViewChild(TooltipComponent, {static: true})
  tooltip: TooltipComponent;

  @ViewChild('popover', {static: true})
  popover: ElementRef<HTMLElement>;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;
  commitsMap$: Observable<Map<string, Commit>>;
  selectedCommitInterval$: Observable<CommitTimeInterval>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  private svg: Svg;
  private renderer: GitGraphRenderer;

  private visualizationSubscription: Subscription;
  private branchesCommitSubscription: Subscription;

  private selectedCommit: Commit;

  private deselectSelectedCommit() {
    if (this.selectedCommit != null) {
      this.renderer.setGraphCommitState(this.selectedCommit.commitId, GraphCommitState.Default);
    }
  }

  ngOnInit() {
    this.initGitGraph();
    this.initEvents();

    this.gitGraphService.scrollLeft.subscribe(value => {
      if (!this.active) {
        this.setScrollLeft(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.visualizationSubscription.unsubscribe();
    this.branchesCommitSubscription.unsubscribe();
  }

  private initEvents(): void {
    this.graphElement.nativeElement.onmouseenter = () => {
      this.active = true;
    };

    this.graphElement.nativeElement.onmouseleave = () => {
      this.active = false;
    };

    this.graphElement.nativeElement.onscroll = () => {
      if (this.active) {
        const scrollLeft = this.graphElement.nativeElement.scrollLeft;
        this.scroll(scrollLeft);
      }
    };
  }

  private setScrollLeft(value: number) {
    this.graphElement.nativeElement.scrollLeft = value;
  }

  private scroll(value: number) {
    this.gitGraphService.scrollLeft.next(value);
  }

  private initGitGraph(): void {
    this.svg = SVG()
      .addTo(this.graphElement.nativeElement);
    this.renderer = new GitGraphRenderer(this.svg,
      {
        onGraphCommitMouseOver: (commit) => {
          this.commitService.setPreviewCommit(commit);
          const element = document.getElementById(commit.commitId);
          this.tooltip.anchorElement = element;
          this.tooltip.commit = commit;
          this.tooltip.active = true;
          // Determine tooltip state
          if (this.selectedCommit == null) {
            // No commit was selected
            this.tooltip.tooltipState = TooltipState.Select;
          } else if (this.selectedCommit != null && this.selectedCommit.commitId === commit.commitId) {
            // Hovered commit is selected commit
            this.tooltip.tooltipState = TooltipState.Deselect;
          } else if (this.selectedCommit != null && this.selectedCommit.date < commit.date) {
            // Hovered commit is newer than selected commit
            this.tooltip.tooltipState = TooltipState.SelectEnd;
          } else if (this.selectedCommit != null && this.selectedCommit.date > commit.date) {
            // Hovered commit is older than selected commit
            this.tooltip.tooltipState = TooltipState.SelectBegin;
          }
        },
        onGraphCommitClick: (commit) => {
          this.visualizationService.setSelectedCommit(commit);
        },
        onGraphCommitMouseOut: (commit) => {
          setTimeout(() => {
            if (!this.tooltip.insideTooltip) {
              this.deselectPreviewCommit();
              this.tooltip.active = false;
            }
          }, 300);
        }
      }
    );
  }

  // Handle menu item selection
  tooltipMenuItemSelected(event: TooltipMenuItemSelected) {
    if (event.commit == null) {
      return;
    }
    const action = event.action;
    if (action === TooltipMenuItem.View) {
      this.visualizationService.setSelectedCommit(event.commit);
    } else if (action === TooltipMenuItem.Deselect) {
      this.visualizationService.setSelectedCommit(null);
    } else if (action === TooltipMenuItem.Begin) {
      this.visualizationService.setSelectedCommitInterval({
        start: event.commit,
        end: this.selectedCommit
      });
    } else if (action === TooltipMenuItem.End) {
      this.visualizationService.setSelectedCommitInterval({
        start: this.selectedCommit,
        end: event.commit
      });
    }
  }

  private deselectPreviewCommit() {
    this.commitService.setPreviewCommit(null);
  }


  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    this.renderer.drawGraph(gitModel);
  }
}
