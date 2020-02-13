import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/reducers';
import * as GitActions from '../../gitgraph/git.action';
import { map, tap } from 'rxjs/operators';
import { Commit } from 'src/app/shared/git/commit.model';
import { GitgraphService } from '../gitgraph.service';

@Component({
  selector: 'cc-commit-message-container',
  templateUrl: './commit-message-container.component.html',
  styleUrls: ['./commit-message-container.component.scss']
})
export class CommitMessageContainerComponent implements OnInit {

  @ViewChild('messageContainer', {static: true})
  messageContainer: ElementRef<HTMLElement>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  commits$: Observable<Commit[]>;

  constructor(
    private store: Store<State>,
    private gitGraphService: GitgraphService
  ) {
    this.commits$ = store.pipe(
        select(store => store.git.commits),
          map(val => [...val]),
          map(val => val.sort(
            (a, b) =>
              a.date.getTime() - b.date.getTime()
          )),
          //tap(val => console.log(`Commits ${JSON.stringify(val)}`))
      );
  }

  ngOnInit() {
    this.initEvents();

    this.gitGraphService.scrollLeft.subscribe(value => {
      if (!this.active) {
        this.setScrollLeft(value);
      }
    });
  }

  private initEvents(): void {
    this.messageContainer.nativeElement.onmouseenter = () => {
      this.active = true;
    };

    this.messageContainer.nativeElement.onmouseleave = () => {
      this.active = false;
    };

    this.messageContainer.nativeElement.onscroll = () => {
      if (this.active) {
        const scrollLeft = this.messageContainer.nativeElement.scrollLeft;
        this.scroll(scrollLeft);
      }
    };
  }

  private setScrollLeft(value: number) {
    this.messageContainer.nativeElement.scrollLeft = value;
  }

  private scroll(value: number) {
    this.gitGraphService.scrollLeft.next(value);
  }

  onCommitsClick() {
    this.store.dispatch(GitActions.fetchCommits());
    this.store.dispatch(GitActions.loadBranches());
  }
}
