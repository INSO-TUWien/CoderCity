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
  // branchTags$: Observable<BranchTag[]> = combineLatest([
  //   this.projectQuery.branches$,
  //   this.graphCommits$
  // ]).pipe(
  //   map(([branches, graphCommits]) => {
  //     return branches.map((branch) => {
  //       if (branch != null) {
  //         const graphCommit = graphCommits.get(branch?.commit?.commitId);
  //         return {
  //           ...branch,
  //           x: graphCommit.x + graphCommit.shape.width() / 2,
  //           y: graphCommit.y + graphCommit.shape.width() / 2,
  //           color: graphCommit.color
  //         };
  //       }
  //     });
  //   }),
  //   tap(branchtags => {
  //     console.log(`Branchtags: ${JSON.stringify(branchtags)}`);
  //   })
  // );

  constructor(
    protected store: GitgraphStore,
  ) {
    super(store);
  }

}
