import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GitStore, GitState } from './git.store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GitQuery extends Query<GitState> {
  commits$ = this.select(state => state.commits);
  commitsMap$ = this.select(state => state.commitsMap);
  sortedCommits$ = this.select(state => state.commits).pipe(
    map(val => [...val]),
    map(val => val.sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime()
    )),
  );
  authors$ = this.select(state => state.authors);
  branches$ = this.select(state => state.branches);
  commitPreview$ = this.select(state => state.commitPreview);

  constructor(protected store: GitStore) {
    super(store);
  }

}
