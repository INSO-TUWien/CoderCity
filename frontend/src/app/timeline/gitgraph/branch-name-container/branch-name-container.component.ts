import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../datastructure/branch.model';
import { Store, select,  } from '@ngrx/store';
import { State } from 'src/app/reducers';

@Component({
  selector: 'cc-branch-name-container',
  templateUrl: './branch-name-container.component.html',
  styleUrls: ['./branch-name-container.component.scss']
})
export class BranchNameContainerComponent implements OnInit {

  branches: string[] = ['master', 'dev', 'feature/12321' ];
  branches$: Observable<Branch[]>;

  constructor(private store: Store<State>) {
    this.branches$ = this.store.pipe(select(store => store.git.branches));
  }

  ngOnInit() {
  }

}
