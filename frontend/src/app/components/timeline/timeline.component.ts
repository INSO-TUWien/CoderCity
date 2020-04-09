import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';
import { GitService } from 'src/app/services/git.service';
import { TimelineQuery } from 'src/app/state/timeline.query';
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
    private gitService: GitService,
    private timelineQuery: TimelineQuery
  ) {
    this.projectInterval$ = this.timelineQuery.projectInterval$;
  }

  ngOnInit() {
  }

}
