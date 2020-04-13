import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { TimeInterval } from '../components/timeline/timeinterval';
import { CommitMessageIndicatorStatus } from "../components/timeline/gitgraph/commit-message-container/indicator-bar/commit-message-indicator/CommitMessageIndicatorStatus";

export interface TimelineState {
   key: string;
   isPlaying: boolean;
   isMinimized: boolean;
   projectInterval: TimeInterval;
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
    indicatorStatus: CommitMessageIndicatorStatus.AuthorColor
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timeline' })
export class TimelineStore extends Store<TimelineState> {

  constructor() {
    super(createInitialState());
  }

}

