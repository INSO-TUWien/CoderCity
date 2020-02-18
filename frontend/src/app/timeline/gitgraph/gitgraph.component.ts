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
import { GitGraphRenderer } from './rendering/gitgraph-renderer';

export const SVG_WIDTH = 1200;
export const SVG_HEIGHT = 240;

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;

  svg: Svg;
  renderer: GitGraphRenderer;

  constructor(private store: Store<State>) {
    this.commits$ = this.store
    .pipe(
      select(store => store.git.commits),
      map(val => [...val]),
      map(val => val.sort(
        (a, b) =>
          a.date.getTime() - b.date.getTime()
      )),
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
    this.initGitGraph();
  }

  private initGitGraph(): void {
    this.svg = SVG()
      .addTo(this.graphElement.nativeElement)
      .size(SVG_WIDTH, SVG_HEIGHT);
    this.renderer = new GitGraphRenderer(this.svg, this.store);
  }

  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    this.renderer.drawGraph(gitModel);
  }
}
