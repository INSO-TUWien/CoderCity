import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable, combineLatest, Subscription } from "rxjs";
import { GitModel } from "../../../model/git-model";
import { Branch } from "src/app/model/branch.model";
import { GitGraph } from "./rendering/gitgraph";
import { CommitService } from "src/app/services/commit.service";
import { VisualizationService } from "src/app/services/visualization.service";
import { VisualizationQuery } from "src/app/state/visualization.query";
import { GraphCommitState } from "./rendering/elements/abstract-graph-commit";
import {
  TooltipComponent,
  TooltipState,
  TooltipMenuItemSelected,
  TooltipMenuItem,
} from "./tooltip/tooltip.component";
import { CommitTimeInterval } from "../commit-timeinterval";
import { Util } from "./rendering/util/util";
import { ProjectQuery } from "src/app/store/project/project.query";
import { Commit } from 'src/app/model/commit.model';
import { GitgraphService } from './state/gitgraph.service';
import { GitgraphQuery, BranchTag } from './state/gitgraph.query';

@Component({
  selector: "cc-gitgraph",
  templateUrl: "./gitgraph.component.html",
  styleUrls: ["./gitgraph.component.scss"],
})
export class GitgraphComponent implements OnInit {

  private selectedLineKeys: string[];
  @ViewChild("gitgraph", { static: true })
  graphElement: ElementRef<HTMLElement>;

  @ViewChild(TooltipComponent, { static: true })
  tooltip: TooltipComponent;

  @ViewChild("popover", { static: true })
  popover: ElementRef<HTMLElement>;

  branches$: Observable<Branch[]>;
  branchTags$: Observable<BranchTag[]>;

  commits$: Observable<Commit[]>;
  commitMap$: Observable<Map<string, Commit>>;
  selectedCommitInterval$: Observable<CommitTimeInterval>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  private gitGraph: GitGraph;
  private visualizationSubscription: Subscription;
  private branchesCommitSubscription: Subscription;
  private selectedCommit: Commit;

  constructor(
    private commitService: CommitService,
    private projectQuery: ProjectQuery,
    private gitGraphService: GitgraphService,
    private gitGraphQuery: GitgraphQuery,
    private visualizationQuery: VisualizationQuery,
    private visualizationService: VisualizationService
  ) {
    // Retrieve commits and sort them by time. (Oldest first)
    this.commitMap$ = this.projectQuery.commitMap$;
    this.branches$ = this.projectQuery.branches$;
    this.branchTags$ = this.gitGraphQuery.branchTags$;
    this.selectedCommitInterval$ = this.visualizationQuery.selectedCommitInterval$;

    this.gitGraphQuery.branchTags$.subscribe(tags => {
      alert(`Branch tags: ${JSON.stringify(Array.from(tags.entries()))}`);
    });

    // Set selected commit to 'selected' state
    this.visualizationSubscription = this.visualizationQuery.selectedCommit$.subscribe(
      (selectedCommit) => {
        // Deselect previous selected commit if existing
        this.deselectSelectedCommit();
        if (selectedCommit != null) {
          this.gitGraph.setCommitDisplayState(
            selectedCommit.commitId,
            GraphCommitState.Selected
          );
          this.selectedCommit = selectedCommit;
        }
      }
    );

    /**
     * Handle commit graph interval selection
     */
    combineLatest([this.commitMap$, this.selectedCommitInterval$]).subscribe(
      ([commits, interval]) => {
        if (this.selectedLineKeys != null) {
          // Reset prior interval selection if exists
          this.selectedLineKeys.forEach((lineKey) => {
            this.gitGraph.setGraphLineState(lineKey, GraphCommitState.Default);
          });
        }

        if (
          commits != null &&
          commits.size > 0 &&
          interval != null &&
          interval.start != null &&
          interval.end != null
        ) {
          const result = Util.getCommitsBetweenAsLineIds(
            interval.end.commitId,
            interval.start.commitId,
            commits
          );

          result.lineCommitKeys.forEach((lineKey) => {
            this.gitGraph.setGraphLineState(lineKey, GraphCommitState.Selected);
          });
          this.selectedLineKeys = result.lineCommitKeys;
        }
      }
    );

    /**
     * React to project data changes and rerender graph.
     */
    this.projectQuery.projectData$.subscribe((projectData) => {
      if (
        projectData?.authors != null &&
        projectData?.branches != null &&
        projectData?.commits != null
      ) {
        this.drawGraph(projectData.branches, projectData.commits);
      }
    });
  }

  private deselectSelectedCommit() {
    if (this.selectedCommit != null) {
      this.gitGraph.setCommitDisplayState(
        this.selectedCommit.commitId,
        GraphCommitState.Default
      );
    }
  }

  ngOnInit() {
    this.initGitGraph();
    this.initEvents();

    this.gitGraphService.scrollLeft.subscribe((value) => {
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
    this.gitGraph = new GitGraph(this.graphElement.nativeElement, {
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
        } else if (
          this.selectedCommit != null &&
          this.selectedCommit.commitId === commit.commitId
        ) {
          // Hovered commit is selected commit
          this.tooltip.tooltipState = TooltipState.Deselect;
        } else if (
          this.selectedCommit != null &&
          this.selectedCommit.date < commit.date
        ) {
          // Hovered commit is newer than selected commit
          this.tooltip.tooltipState = TooltipState.SelectEnd;
        } else if (
          this.selectedCommit != null &&
          this.selectedCommit.date > commit.date
        ) {
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
      },
    });
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
        end: this.selectedCommit,
      });
    } else if (action === TooltipMenuItem.End) {
      this.visualizationService.setSelectedCommitInterval({
        start: this.selectedCommit,
        end: event.commit,
      });
    }
  }

  private deselectPreviewCommit() {
    this.commitService.setPreviewCommit(null);
  }

  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    this.gitGraph.drawGraph(gitModel);
    this.gitGraphService.setBranchTags(this.gitGraph);
  }
}
