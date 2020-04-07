import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';
import { GitService } from 'src/app/services/git.service';

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

  constructor(private gitService: GitService) { }

  ngOnInit() {
  }

  onCommitsClick() {
    this.gitService.getBranches();
    this.gitService.getCommits();
  }
}
