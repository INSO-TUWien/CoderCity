import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TimelineStore, TimelineState } from './timeline.store';
import { withLatestFrom, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Commit } from '../../model/commit.model';
import { ProjectQuery } from '../project/project.query';

@Injectable({ providedIn: 'root' })
export class TimelineQuery extends Query<TimelineState> {

  projectInterval$ = this.select(state => state.projectInterval);
  selectedIntervalCommits$ = this.select(state => state.selectedIntervalCommits);
  selectedIntervalCommitsSortedByTime$: Observable<Commit[]> = this.selectedIntervalCommits$.pipe(
    withLatestFrom(this.projectQuery.commits$),
    map(([selectedCommitsIds, commits]) => {
      const selectedCommits = commits.filter((commit) => selectedCommitsIds.includes(commit.commitId));
      const sortedSelectedCommits = selectedCommits.sort(
        (a, b) =>
          a.date.getTime() - b.date.getTime()
      );
      return sortedSelectedCommits;
    })
  );
  indicatorStatus$ = this.select(state => state.indicatorStatus);


  constructor(
    protected store: TimelineStore,
    private projectQuery: ProjectQuery
  ) {
    super(store);
  }

}
