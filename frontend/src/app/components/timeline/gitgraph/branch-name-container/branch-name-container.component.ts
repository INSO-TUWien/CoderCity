import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/model/branch.model';
import { ProjectQuery } from 'src/app/store/project/project.query';

@Component({
  selector: 'cc-branch-name-container',
  templateUrl: './branch-name-container.component.html',
  styleUrls: ['./branch-name-container.component.scss']
})
export class BranchNameContainerComponent implements OnInit {

  branches: string[] = ['master', 'dev', 'feature/12321' ];
  branches$: Observable<Branch[]>;

  constructor(private projectQuery: ProjectQuery) {
    this.branches$ = this.projectQuery.branches$;
  }

  ngOnInit() {
  }

}
