import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { Observable, combineLatest } from 'rxjs';
import { Commit } from 'src/app/model/commit.model';
import { map } from 'rxjs/operators';
import { GitModel } from '../../../model/git-model';
import { Branch } from 'src/app/model/branch.model';
import { cloneDeep } from 'lodash-es';
import { GitGraphRenderer } from './rendering/gitgraph-renderer';
import { GitgraphService } from './gitgraph.service';
import { CommitService } from 'src/app/services/commit.service';
import { GitQuery } from 'src/app/state/git.query';

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef<HTMLElement>;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  svg: Svg;
  renderer: GitGraphRenderer;

  constructor(
    private commitService: CommitService,
    private gitQuery: GitQuery,
    private gitGraphService: GitgraphService
    ) {
      // Retrieve commits and sort them by time. (Oldest first)
    this.commits$ = this.gitQuery.sortedCommits$;
    this.branches$ = this.gitQuery.branches$.pipe( map(val => [...val]));

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
    this.initGitGraph();
    this.initEvents();

    this.gitGraphService.scrollLeft.subscribe(value => {
      if (!this.active) {
        this.setScrollLeft(value);
      }
    });
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
      .addTo(this.graphElement.nativeElement)
    this.renderer = new GitGraphRenderer(this.svg, (commit) => {
      this.commitService.setPreviewCommit(commit);
    });
  }


  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    this.renderer.drawGraph(gitModel);
  }
}
