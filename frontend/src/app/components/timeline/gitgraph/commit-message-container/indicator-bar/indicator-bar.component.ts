import { Component, OnInit } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { Observable } from 'rxjs';
import { GitQuery } from 'src/app/state/git.query';

@Component({
  selector: 'cc-indicator-bar',
  templateUrl: './indicator-bar.component.html',
  styleUrls: ['./indicator-bar.component.scss']
})
export class IndicatorBarComponent implements OnInit {

  commits$: Observable<Commit[]>;

  constructor(
    private gitQuery: GitQuery
  ) {
    this.commits$ = this.gitQuery.sortedCommits$;
  }

  ngOnInit() {
  }

}
