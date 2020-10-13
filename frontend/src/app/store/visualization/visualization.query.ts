import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { VisualizationStore, VisualizationState } from './visualization.store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectQuery } from '../project/project.query';

@Injectable({ providedIn: 'root' })
export class VisualizationQuery extends Query<VisualizationState> {

  constructor(
    protected store: VisualizationStore,
    private projectQuery: ProjectQuery) {
    super(store);
  }

  isFilterPanelActive$ = this.select(state => state.isFilterViewActive);

  selectedObject$ = this.select(state => state.selectedObject);
  selectedCommit$ = this.select(state => state.selectedCommit);
  selectedCommitInterval$ = this.select(state => state.selectedCommitInterval);
  files$ = this.select(state => state.files);
  projectFiles$ = this.select(state => state.projectFiles);
  private authorColorMap$ = this.projectQuery.authorColorMap$;

  selectedCommitTimeIntervalWithAuthorColor$ = combineLatest(
    this.selectedCommitInterval$,
    this.authorColorMap$
  ).pipe(
    map(([interval, authors]) => {
      let result = null;
      if (interval != null && authors != null && interval.start != null && interval.end != null && authors.size > 0) {
        result = {
          start: {
            ...interval.start,
            authorColor: authors.get(interval.start.authorName + interval.start.mail)
          },
          end: {
            ...interval.end,
            authorColor: authors.get(interval.end.authorName + interval.end.mail)
          },
        };
      }
      return result;
    })
  );

  selectedCommitWithAuthorColor$ = combineLatest(
    this.selectedCommit$,
    this.authorColorMap$
  ).pipe(
    map(([commit, authors]) => {
      let result = null;
      if (commit != null && authors != null && authors.size > 0) {
        result = {
          ...commit,
          authorColor: authors.get(commit.authorName + commit.mail),
        };
      }
      return result;
    })
  );

}
