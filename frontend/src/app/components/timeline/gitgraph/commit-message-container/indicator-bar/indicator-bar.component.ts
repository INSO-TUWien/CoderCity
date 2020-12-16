import { Component, OnInit } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { Observable, combineLatest } from 'rxjs';
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { Author } from 'src/app/model/author.model';

@Component({
  selector: 'cc-indicator-bar',
  templateUrl: './indicator-bar.component.html',
  styleUrls: ['./indicator-bar.component.scss']
})
export class IndicatorBarComponent implements OnInit {

  commits$: Observable<Commit[]>;
  authorColorMap$: Observable<Map<string, string>>;
  authors$: Observable<Author[]>

  commitsWithAuthorColor$;

  constructor(
    private projectQuery: ProjectQuery,
  ) {
    this.commits$ = this.projectQuery.sortedCommits$;
    this.authors$ = this.projectQuery.authors$;
    this.authorColorMap$ = this.projectQuery.authorColorMap$;

    this.commitsWithAuthorColor$ = combineLatest(this.commits$, this.authors$)
      .pipe(
        map(([commits, authors]) => {
          let result = [];
          if (commits != null && authors != null && commits.length > 0 && authors.length > 0) {
            result = commits.map(
              (commit) => ({
                ...commit,
                // Get color of author if author exists
                authorColor: authors?.find((a) => Author.hashCode(a) === commit.authorName + commit.mail)?.color
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
