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

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef<HTMLElement>;

  @ViewChild(TooltipComponent, {static: true})
  tooltip: TooltipComponent;

  @ViewChild('popover', {static: true})
  popover: ElementRef<HTMLElement>;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  private svg: Svg;
  private renderer: GitGraphRenderer;

  private visualizationSubscription: Subscription;
  private branchesCommitSubscription: Subscription;

  private previousSelectedCommit: Commit;

  constructor(
    private commitService: CommitService,
    private gitQuery: GitQuery,
    private gitGraphService: GitgraphService,
    private visualizationQuery: VisualizationQuery,
    private visualizationService: VisualizationService
    ) {
      // Retrieve commits and sort them by time. (Oldest first)
    this.commits$ = this.gitQuery.sortedCommits$;
    this.branches$ = this.gitQuery.branches$.pipe( map(val => [...val]));

    // Set selected commit to selected state
    this.visualizationSubscription = this.visualizationQuery.selectedCommit$.subscribe(
      (selectedCommit) => {
        // Deselect previous selected commit if existing
        if (this.previousSelectedCommit != null) {
          this.renderer.setGraphCommitState(this.previousSelectedCommit.commitId, GraphCommitState.Default);
        }
        if (selectedCommit != null) {
          this.renderer.setGraphCommitState(selectedCommit.commitId, GraphCommitState.Selected);
          this.previousSelectedCommit = selectedCommit;
        }
    });

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
          if (this.previousSelectedCommit == null) {
            // No commit was selected
            this.tooltip.tooltipState = TooltipState.Select;
          } else if (this.previousSelectedCommit != null && this.previousSelectedCommit.commitId === commit.commitId) {
            // Hovered commit is selected commit
            this.tooltip.tooltipState = TooltipState.Deselect;
          } else if (this.previousSelectedCommit != null && this.previousSelectedCommit.date < commit.date) {
            // Hovered commit is newer than selected commit
            this.tooltip.tooltipState = TooltipState.SelectEnd;
          } else if (this.previousSelectedCommit != null && this.previousSelectedCommit.date > commit.date) {
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

    } else if (action === TooltipMenuItem.End) {

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
