import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GitService } from '../shared/git/git.service';
import { Branch } from '../shared/git/branch.model';
import { Commit } from '../shared/git/commit.model';
@Component({
  selector: 'cc-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  commits: Commit[];

  constructor(private gitService: GitService) { }

  ngOnInit() {
  }

  onCommitsClick() {
    this.gitService.getGitCommits().subscribe(
      (result) => {
        console.log(`${JSON.stringify(result)}`);
      }
    )
  }
}
