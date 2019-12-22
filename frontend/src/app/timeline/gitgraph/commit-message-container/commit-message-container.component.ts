import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cc-commit-message-container',
  templateUrl: './commit-message-container.component.html',
  styleUrls: ['./commit-message-container.component.scss']
})
export class CommitMessageContainerComponent implements OnInit {

  commits: string[] = [
    'Initial commit',
    'First commit',
    'Second commit',
    'Third commit',
    '4. commit',
    'Second commit',
    'Third commit',
    '4. commit'
  ];

  constructor() { }

  ngOnInit() {
  }

}
