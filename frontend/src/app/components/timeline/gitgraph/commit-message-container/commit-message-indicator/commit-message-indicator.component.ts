import { Component, OnInit, Input } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { TimelineQuery } from 'src/app/state/timeline.query';
import { Observable } from 'rxjs';
import { CommitMessageIndicatorStatus } from './CommitMessageIndicatorStatus';

@Component({
  selector: 'cc-commit-message-indicator',
  templateUrl: './commit-message-indicator.component.html',
  styleUrls: ['./commit-message-indicator.component.scss']
})
export class CommitMessageIndicatorComponent implements OnInit {

  CommitMessageIndicatorStatus = CommitMessageIndicatorStatus;

  status: CommitMessageIndicatorStatus = CommitMessageIndicatorStatus.Author;
  status$: Observable<CommitMessageIndicatorStatus>;

  @Input()
  commit: Commit;

  constructor(private timelineQuery: TimelineQuery) {
    this.status$ = this.timelineQuery.indicatorStatus$;
    // this.timelineQuery.indicatorStatus$.subscribe((status) => {
    //   this.status = status;
    // });
  }

  ngOnInit() {
  }

}
