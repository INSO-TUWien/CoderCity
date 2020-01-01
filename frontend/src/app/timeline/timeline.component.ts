import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GitService } from '../shared/git/git.service';
import { Branch } from '../shared/git/branch.model';
import { Commit } from '../shared/git/commit.model';
import { Store } from '@ngrx/store';
@Component({
  selector: 'cc-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  commits: Commit[];

  constructor() { }

  ngOnInit() {
  }
}
