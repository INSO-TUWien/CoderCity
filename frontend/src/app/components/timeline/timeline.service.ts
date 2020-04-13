import { Injectable } from '@angular/core';
import { TimelineStore } from 'src/app/state/timeline.store';
import { TimeInterval } from './timeinterval';
import { CommitMessageIndicatorStatus } from "./gitgraph/commit-message-container/indicator-bar/commit-message-indicator/CommitMessageIndicatorStatus";

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private timelineStore: TimelineStore) { }

  updateProjectInterval(interval: TimeInterval) {
    this.timelineStore.update(state => ({
      ...state,
      projectInterval: interval
    }));
  }

  setIndicatorStatus(indicatorStatus: CommitMessageIndicatorStatus): void {
    this.timelineStore.update(state => ({
      ...state,
      indicatorStatus: indicatorStatus
    }));
  }

  changeIndicatorStatus(): void {
    this.timelineStore.update(state => {
      const newStatus = (state.indicatorStatus === CommitMessageIndicatorStatus.Author)
        ? CommitMessageIndicatorStatus.AuthorColor
        : CommitMessageIndicatorStatus.Author;
      return {
        ...state,
        indicatorStatus: newStatus
      };
    });
  }
}
