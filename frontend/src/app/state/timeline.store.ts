import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface TimelineState {
   key: string;
   isPlaying: boolean;
   isMinimized: boolean;
}

export function createInitialState(): TimelineState {
  return {
    key: '',
    isPlaying: false,
    isMinimized: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'timeline' })
export class TimelineStore extends Store<TimelineState> {

  constructor() {
    super(createInitialState());
  }

}

