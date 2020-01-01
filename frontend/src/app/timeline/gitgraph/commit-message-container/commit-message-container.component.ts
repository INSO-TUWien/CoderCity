import { Component, OnInit } from '@angular/core';
import { Commit } from '../datastructure/commit.model';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/reducers';
import * as GitActions from '../../gitgraph/git.action';

@Component({
  selector: 'cc-commit-message-container',
  templateUrl: './commit-message-container.component.html',
  styleUrls: ['./commit-message-container.component.scss']
})
export class CommitMessageContainerComponent implements OnInit {

  commits$: Observable<Commit[]>;

  constructor(private store: Store<State>) {
    this.commits$ = store.pipe(select(store => store.git.commits));
  }

  ngOnInit() {
  }

  onCommitsClick() {
    this.store.dispatch(GitActions.fetchCommits());
    this.store.dispatch(GitActions.loadBranches());
  }
}
