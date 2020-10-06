import { Component, OnInit } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { Observable, combineLatest } from 'rxjs';
import { GitQuery } from 'src/app/state/git.query';
import { VisualizationQuery } from 'src/app/store/visualization/visualization.query';
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { ProjectQuery } from 'src/app/store/project/project.query';

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
    private projectQuery: ProjectQuery,
  ) {
    this.commits$ = this.projectQuery.sortedCommits$;
    this.authorColorMap$ = this.projectQuery.authorColorMap$;

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
