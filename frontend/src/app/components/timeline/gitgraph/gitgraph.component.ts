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
import { createPopper } from '@popperjs/core';
import { faEye, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  faEye = faEye;
  faArrowRight = faArrowRight;

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef<HTMLElement>;

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

  private selectedCommit: Commit;
  private popper;
  tooltipActive: boolean = false;
  private insideTooltip = false;

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
    this.visualizationSubscription = this.visualizationQuery.selectedCommit$.subscribe((selectedCommit) => {
      if (selectedCommit !== null) {
        if (this.selectedCommit != null) {
          this.renderer.setGraphCommitState(this.selectedCommit.commitId, GraphCommitState.Default);
        }
        this.renderer.setGraphCommitState(selectedCommit.commitId, GraphCommitState.Selected);
        this.selectedCommit = selectedCommit;
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

  /**
   * Tooltips
   */
  private initTooltip(anchorElement) {
    if (anchorElement != null) {
      if (this.popper != null) {
        this.popper.destroy();
      }
      this.popper = createPopper(anchorElement, this.popover.nativeElement, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    } else {
      alert(`anchor null`);
    }
  }

  onTooltipMouseEnter() {
    this.insideTooltip = true;
  }

  onTooltipMouseLeave() {
    this.insideTooltip = false;
    this.commitService.setPreviewCommit(null);
    this.tooltipActive = false;
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
          this.tooltipActive = true;
          this.commitService.setPreviewCommit(commit);
          const element = document.getElementById(commit.commitId);
          this.initTooltip(element);
        },
        onGraphCommitClick: (commit) => {
          this.visualizationService.setSelectedCommit(commit);
        },
        onGraphCommitMouseOut: (commit) => {
          setTimeout(() => {
            if (!this.insideTooltip) {
              this.commitService.setPreviewCommit(null);
              this.tooltipActive = false;
            }
          }, 300);
        }
      }
    );
  }


  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    this.renderer.drawGraph(gitModel);
  }
}
