import { Component, OnInit } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { Observable, combineLatest } from 'rxjs';
import { GitQuery } from 'src/app/state/git.query';
import { VisualizationQuery } from 'src/app/state/visualization.query';
import { withLatestFrom, tap, map } from 'rxjs/operators';

@Component({
  selector: 'cc-indicator-bar',
  templateUrl: './indicator-bar.component.html',
  styleUrls: ['./indicator-bar.component.scss']
})
export class IndicatorBarComponent implements OnInit {

  commits$: Observable<Commit[]>;
  authorColorMap$: Observable<Map<string, string>>;

  commitsWithAuthorColor$;

  constructor(
    private gitQuery: GitQuery,
    private visualizationQuery: VisualizationQuery
  ) {
    this.commits$ = this.gitQuery.sortedCommits$;
    this.authorColorMap$ = this.visualizationQuery.authorColorMap$;

    this.commitsWithAuthorColor$ = combineLatest(this.commits$, this.authorColorMap$)
      .pipe(
        map(([commits, authors]) => {
          let result = [];
          if (commits != null && authors != null && commits.length > 0 && authors.size > 0) {
            result = commits.map(
              (commit) => ({
                ...commit,
                authorColor: authors.get(commit.authorName + commit.mail)
              })
            );
          }
          return result;
        })
      );
  }

  ngOnInit() {
  }

}
