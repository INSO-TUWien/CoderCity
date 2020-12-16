import { Component, OnInit } from "@angular/core";
import { Commit } from "../../model/commit.model";
import { Observable, Subject, BehaviorSubject, of, combineLatest } from "rxjs";
import { tap, map, timeInterval } from "rxjs/operators";
import { VisualizationQuery } from "src/app/store/visualization/visualization.query";
import { ProjectQuery } from 'src/app/store/project/project.query';

export enum SelectionState {
  None,
  Preview,
  Selected,
}

export const MOCK_COMMIT = {
  parentCommitIDs: ["7e4209fad95b7ea7276f3056b745b5f207bbbdbb"],
  childCommitIDs: [
    "f21312c46cb049039c7c3e7ebe7d6d1a344d28a4",
    "c74eac572e08d4c6280af746a39231d7590bb5ff",
  ],
  commitId: "98a1b4e18352bc0a6b54abac865dcd8acbab7e03",
  authorName: "Sunny Singh",
  mail: "sunnysingh@posteo.de",
  date: new Date("2019-04-06T12:01:46.000Z"),
  message: "initial commit\n",
};

@Component({
  selector: "cc-selection-popover",
  templateUrl: "./selection-popover.component.html",
  styleUrls: ["./selection-popover.component.scss"],
})
export class SelectionPopoverComponent implements OnInit {
  Mode = SelectionState;
  mode = SelectionState.Preview;
  hasSelectedCommit: boolean = false;
  commitPreview$: Observable<Commit>;
  selectedCommit$: Observable<Commit>;
  authorColorMap$: Observable<Map<string, string>>;
  commitPreviewWithAuthorColor$: Observable<any>;
  selectedCommitWithAuthorColor$: Observable<any>;

  private selectedCommitSubscription;
  private commitPreviewSubscription;

  constructor(
    private visualizationQuery: VisualizationQuery,
    private projectQuery: ProjectQuery,
  ) {
    // this.commitPreview$ = of(MOCK_COMMIT);
    this.commitPreview$ = this.visualizationQuery.commitPreview$;
    this.authorColorMap$ = this.projectQuery.authorColorMap$;
    this.selectedCommit$ = this.visualizationQuery.selectedCommit$;
    this.selectedCommitWithAuthorColor$ = this.visualizationQuery.selectedCommitWithAuthorColor$;

    this.commitPreviewSubscription = this.commitPreview$.subscribe((commit) => {
      if (commit == null) {
        if (this.hasSelectedCommit === false) {
          this.mode = SelectionState.None;
        } else {
          this.mode = SelectionState.Selected;
        }
      } else {
        this.mode = SelectionState.Preview;
      }
    });

    this.selectedCommitSubscription = this.selectedCommit$.subscribe((commit) => {
      if (commit == null) {
        this.mode = SelectionState.None;
        this.hasSelectedCommit = false;
      } else {
        this.mode = SelectionState.Selected;
        this.hasSelectedCommit = true;
      }
    });

    this.commitPreviewWithAuthorColor$ = combineLatest(
      this.commitPreview$,
      this.authorColorMap$
    ).pipe(
      map(([commit, authors]) => {
        let result = null;
        if (commit != null && authors != null && authors.size > 0) {
          result = {
            ...commit,
            authorColor: authors.get(commit.authorName + commit.mail),
          };
        }
        return result;
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.commitPreviewSubscription.unsubscribe();
    this.selectedCommitSubscription.unsubscribe();
  }
}
