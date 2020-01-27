import { Component, OnInit } from '@angular/core';
import { Store, select} from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Commit } from '../shared/git/commit.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum SelectionState {
  Preview,
  Interval
}
@Component({
  selector: 'cc-selection-popover',
  templateUrl: './selection-popover.component.html',
  styleUrls: ['./selection-popover.component.scss']
})
export class SelectionPopoverComponent implements OnInit {

  mode = SelectionState.Preview;
  Mode = SelectionState;

  commitPreview$: Observable<Commit>;

  constructor(private store: Store<State>) {
    this.commitPreview$ = store.pipe(
      select(store => store.git.commitPreview),
      tap((val) => {
        console.log(`Commit preview: ${JSON.stringify(val, (key, value) => {
          if (key === 'parentCommits') {
            return [];
          } else if (key === 'childCommits') {
            return (value.map((commit) => {
              return {
                commitId: commit.commitId,
                message: commit.message
              };
            }));
          } else {
            return value;
          }
        })}`);
      })
    );
  }

  ngOnInit() {
  }

}
