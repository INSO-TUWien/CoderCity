import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GitgraphStore, GitgraphState } from './gitgraph.store';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Branch } from 'src/app/model/branch.model';

export interface BranchTag extends Branch {
  x: number;
  y: number;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class GitgraphQuery extends Query<GitgraphState> {

  branchTags$ = this.select(state => state.branchTags);

  constructor(
    protected store: GitgraphStore,
  ) {
    super(store);
  }

}
