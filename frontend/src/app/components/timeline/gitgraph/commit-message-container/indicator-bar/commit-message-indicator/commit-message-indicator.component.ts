import { Component, OnInit, Input } from '@angular/core';
import { Commit } from 'src/app/model/commit.model';
import { TimelineQuery } from 'src/app/store/timeline/timeline.query';
import { Observable } from 'rxjs';
import { CommitMessageIndicatorStatus } from './CommitMessageIndicatorStatus';
import { darkenColor } from 'src/app/util/color-scheme';

@Component({
  selector: 'cc-commit-message-indicator',
  template: `
    <div class="branch-indicator d-flex justify-content-center align-items-center">
      <div 
          *ngIf="(status$ | async) === CommitMessageIndicatorStatus.AuthorColor" 
          [style.backgroundColor]="color"
          class="indicator"></div>
      <cc-author-label
          *ngIf="(status$ | async) === CommitMessageIndicatorStatus.Author"
          [name]="commit.authorName"
          [color]="color"
          size='xs'
      ></cc-author-label>
    </div>
  `,
  styles: [`
  .branch-indicator {
    height: 18px;
    width: 18px;
    margin-right: -14px;
  }

  .indicator {
      height: 4px;
      width: 4px;
      border-radius: 2px;
      background: #0AB6B9;
      display: inline-block;
  }`]
})
export class CommitMessageIndicatorComponent implements OnInit {

  CommitMessageIndicatorStatus = CommitMessageIndicatorStatus;
  status$: Observable<CommitMessageIndicatorStatus>;

  @Input()
  commit: Commit;

  @Input()
  color: string;

  get darkenedAuthorColor() {
    return darkenColor(this.color, 0.2);
  }

  constructor(
    private timelineQuery: TimelineQuery,
  ) {
    this.status$ = this.timelineQuery.indicatorStatus$;

  }

  ngOnInit() {
  }

}
