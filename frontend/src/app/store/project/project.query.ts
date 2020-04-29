import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProjectStore, ProjectState } from './project.store';

@Injectable({ providedIn: 'root' })
export class ProjectQuery extends QueryEntity<ProjectState> {

  authors$ = this.select(state => state.projectData.authors);
  branches$ = this.select(state => state.projectData.branches);
  commits$ = this.select(state => state.projectData.commits);

  constructor(protected store: ProjectStore) {
    super(store);
  }
}
