import { Injectable } from '@angular/core';
import { TimeInterval } from './timeinterval';
import { CommitMessageIndicatorStatus } from "./gitgraph/commit-message-container/indicator-bar/commit-message-indicator/CommitMessageIndicatorStatus";
import { Commit } from 'src/app/model/commit.model';
import { TimelineStore } from 'src/app/store/timeline/timeline.store';

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

  setSelectedIntervalCommits(commitIds: string[]) {
    this.timelineStore.update(state => ({
      ...state,
      selectedIntervalCommits: commitIds
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
