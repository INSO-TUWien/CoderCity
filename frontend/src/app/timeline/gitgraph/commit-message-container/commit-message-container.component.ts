import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/reducers';
import * as GitActions from '../../gitgraph/git.action';
import { map, tap } from 'rxjs/operators';
import { Commit } from 'src/app/shared/git/commit.model';

@Component({
  selector: 'cc-commit-message-container',
  templateUrl: './commit-message-container.component.html',
  styleUrls: ['./commit-message-container.component.scss']
})
export class CommitMessageContainerComponent implements OnInit {

  commits$: Observable<Commit[]>;

  constructor(private store: Store<State>) {
    this.commits$ = store.pipe(
        select(store => store.git.commits),
          map(val => [...val]),
          map(val => val.sort(
            (a, b) =>
              a.date.getTime() - b.date.getTime()
          )),
          tap(val => console.log(`Commits ${JSON.stringify(val)}`))
      );
  }

  ngOnInit() {
  }

  onCommitsClick() {
    this.store.dispatch(GitActions.fetchCommits());
    this.store.dispatch(GitActions.loadBranches());
  }
}
