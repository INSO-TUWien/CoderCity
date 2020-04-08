import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { TimeInterval } from '../components/timeline/timeinterval';

export interface TimelineState {
   key: string;
   isPlaying: boolean;
   isMinimized: boolean;
   projectInterval: TimeInterval;
}

export function createInitialState(): TimelineState {
  return {
    key: '',
    isPlaying: false,
    isMinimized: true,
    projectInterval: {
      start: null,
      end: null
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timeline' })
export class TimelineStore extends Store<TimelineState> {

  constructor() {
    super(createInitialState());
  }

}

