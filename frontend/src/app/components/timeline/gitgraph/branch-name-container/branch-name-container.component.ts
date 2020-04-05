import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/model/branch.model';
import { GitQuery } from 'src/app/state/git.query';

@Component({
  selector: 'cc-branch-name-container',
  templateUrl: './branch-name-container.component.html',
  styleUrls: ['./branch-name-container.component.scss']
})
export class BranchNameContainerComponent implements OnInit {

  branches: string[] = ['master', 'dev', 'feature/12321' ];
  branches$: Observable<Branch[]>;

  constructor(private gitQuery: GitQuery) {
    this.branches$ = this.gitQuery.branches$;
  }

  ngOnInit() {
  }

}
