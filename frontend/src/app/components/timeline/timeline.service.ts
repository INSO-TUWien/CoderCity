import { Injectable } from '@angular/core';
import { TimelineStore } from 'src/app/state/timeline.store';
import { TimeInterval } from './timeinterval';

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
}
