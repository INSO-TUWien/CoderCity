import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cc-branch-name-container',
  templateUrl: './branch-name-container.component.html',
  styleUrls: ['./branch-name-container.component.scss']
})
export class BranchNameContainerComponent implements OnInit {

  branches: String[] = ['master', 'dev', 'feature/12321' ];

  constructor() { }

  ngOnInit() {
  }

}
