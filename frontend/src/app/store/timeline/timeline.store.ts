import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { CommitMessageIndicatorStatus } from 'src/app/components/timeline/gitgraph/commit-message-container/indicator-bar/commit-message-indicator/CommitMessageIndicatorStatus';
import { TimeInterval } from 'src/app/components/timeline/timeinterval';

export interface TimelineState {
   key: string;
   isPlaying: boolean;
   isMinimized: boolean;
   projectInterval: TimeInterval;
   selectedIntervalCommits: string[];
   indicatorStatus: CommitMessageIndicatorStatus;
}

export function createInitialState(): TimelineState {
  return {
    key: '',
    isPlaying: false,
    isMinimized: true,
    projectInterval: {
      start: null,
      end: null
    },
    selectedIntervalCommits: [],
    indicatorStatus: CommitMessageIndicatorStatus.Author
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timeline' })
export class TimelineStore extends Store<TimelineState> {

  constructor() {
    super(createInitialState());
  }

}

