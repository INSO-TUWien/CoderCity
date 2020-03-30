import { Component, OnInit } from "@angular/core";
import { Commit } from "../../model/commit.model";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { GitQuery } from 'src/app/state/git.query';

export enum SelectionState {
  None,
  Preview,
  Interval
}
@Component({
  selector: "cc-selection-popover",
  templateUrl: "./selection-popover.component.html",
  styleUrls: ["./selection-popover.component.scss"]
})
export class SelectionPopoverComponent implements OnInit {
  Mode = SelectionState;
  mode = SelectionState.None;
  commitPreview$: Observable<Commit>;


  constructor(
    private gitQuery: GitQuery
  ) {
    this.commitPreview$ = this.gitQuery.commitPreview$;
    this.gitQuery.commitPreview$.subscribe(
      (commit) => {
        console.log(`Commit`);
        if (commit == null) {
          this.mode = SelectionState.None;
        } else {
          this.mode = SelectionState.Preview;
        }
      }
    );
  }

  ngOnInit() {}
}
