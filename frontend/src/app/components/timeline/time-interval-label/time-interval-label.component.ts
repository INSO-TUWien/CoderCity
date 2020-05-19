import { Component, OnInit, Input } from '@angular/core';
import { TimeInterval } from '../timeinterval';

@Component({
  selector: 'cc-time-interval-label',
  templateUrl: './time-interval-label.component.html',
  styleUrls: ['./time-interval-label.component.scss']
})
export class TimeIntervalLabelComponent implements OnInit {

  @Input() interval: TimeInterval;

  get isIntervalDefined(): boolean {
    if (this.interval.start != null && this.interval != null) {
      return true;
    } else {
      return false;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
