import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TimelineStore, TimelineState } from './timeline.store';

@Injectable({ providedIn: 'root' })
export class TimelineQuery extends Query<TimelineState> {

  projectInterval$ = this.select(state => state.projectInterval);
  indicatorStatus$ = this.select(state => state.indicatorStatus);

  constructor(protected store: TimelineStore) {
    super(store);
  }

}
