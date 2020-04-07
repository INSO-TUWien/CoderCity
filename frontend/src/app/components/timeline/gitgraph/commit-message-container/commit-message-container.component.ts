import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Commit } from 'src/app/model/commit.model';
import { GitgraphService } from '../gitgraph.service';
import { faPlay, faUser } from '@fortawesome/free-solid-svg-icons';
import { GitService } from 'src/app/services/git.service';
import { GitQuery } from 'src/app/state/git.query';
import { Branch } from 'src/app/model/branch.model';

@Component({
  selector: 'cc-commit-message-container',
  templateUrl: './commit-message-container.component.html',
  styleUrls: ['./commit-message-container.component.scss']
})
export class CommitMessageContainerComponent implements OnInit {

  faPlay = faPlay;
  faUser = faUser;

  @ViewChild('messageContainer', {static: true})
  messageContainer: ElementRef<HTMLElement>;

  // Element is active when mouse is hovering above it.
  active: boolean;

  commits$: Observable<Commit[]>;
  branches$: Observable<Branch[]>;

  constructor(
    private gitService: GitService,
    private gitQuery: GitQuery,
    private gitGraphService: GitgraphService
  ) {
    this.commits$ = this.gitQuery.sortedCommits$;
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
    this.gitService.getBranches();
    this.gitService.getCommits();
  }
}
