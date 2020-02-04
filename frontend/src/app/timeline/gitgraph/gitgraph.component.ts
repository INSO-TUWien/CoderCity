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

@Component({
  selector: 'cc-gitgraph',
  templateUrl: './gitgraph.component.html',
  styleUrls: ['./gitgraph.component.scss']
})
export class GitgraphComponent implements OnInit {

  @ViewChild('gitgraph', {static: true})
  graphElement: ElementRef;

  STROKE_WIDTH = 3;
  SVG_WIDTH = 1200;
  SVG_HEIGHT = 840;

  branches$: Observable<Branch[]>;
  commits$: Observable<Commit[]>;

  svg: Svg;
  renderer: GitGraphRenderer;

  g_x: number = 0;
  g_y: number = 0;

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
    this.svg = SVG().addTo(this.graphElement.nativeElement).size(this.SVG_WIDTH, this.SVG_HEIGHT);
    this.renderer = new GitGraphRenderer(this.svg, this.store);
  }

  private drawGraph(branches: Branch[], commits: Commit[]) {
    const gitModel = new GitModel(branches, commits);
    gitModel.rebuild();

    this.renderer.renderGitModel(gitModel);

  /*   gitModel.commits.forEach((commit, key, map) => {
      this.renderCommitByTime(this.svg, this.g_x, this.g_y, commit);
      this.g_x++;
      this.g_y++;
    });
    this.renderer.render(); */
  }
}
