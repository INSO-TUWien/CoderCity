import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GitStore, GitState } from './git.store';

@Injectable({ providedIn: 'root' })
export class GitQuery extends Query<GitState> {
  commitPreview$ = this.select(state => state.commitPreview);

  constructor(protected store: GitStore) {
    super(store);
  }

}
