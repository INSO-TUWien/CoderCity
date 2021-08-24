import { Injectable } from '@angular/core';
import { GitgraphStore } from './gitgraph.store';
import { BehaviorSubject } from 'rxjs';
import { AbstractGraphCommit } from '../gitgraph/elements/abstract-graph-commit';
import { ProjectQuery } from 'src/app/store/project/project.query';
import { tap } from 'rxjs/operators';
import { GitGraph } from '../gitgraph/gitgraph';

@Injectable({ providedIn: 'root' })
export class GitgraphService {

  scrollLeft: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private gitgraphStore: GitgraphStore,
    private projectQuery: ProjectQuery
  ) {
  }

  setBranchTags(gitgraph: GitGraph) {
    this.projectQuery.branches$.pipe(
      tap(branches => {
        const branchTags = branches.map((branch) => {
          if (branch != null) {
            const graphCommit = gitgraph?.graphCommits?.get(branch?.commit?.commitId);
            return {
              ...branch,
              x: graphCommit.x + graphCommit.shape.width() / 2,
              y: gitgraph.getHeight(),
              color: graphCommit.color
            };
          }
        });
        this.gitgraphStore.update(state => ({
          ...state,
          branchTags
        }));
      }),
      // tap(branchtags => {
      //   console.log(`Branchtags: ${JSON.stringify(branchtags)}`);
      // })
    ).subscribe();
  }

}
