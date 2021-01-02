import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';
import { TimelineQuery } from 'src/app/store/timeline/timeline.query';
import { Observable} from 'rxjs';
import { TimeInterval } from './timeinterval';

@Component({
  selector: 'cc-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  faPlay = faPlay;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  isExpanded: boolean = false;
  projectInterval$: Observable<TimeInterval>;

  constructor(
    private timelineQuery: TimelineQuery
  ) {
    this.projectInterval$ = this.timelineQuery.projectInterval$;
  }

  ngOnInit() {
  }

  onToggleExpand() {
    
  }

}
