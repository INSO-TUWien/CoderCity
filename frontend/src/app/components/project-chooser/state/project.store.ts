import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ProjectState extends EntityState<Project> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'project' })
export class ProjectStore extends EntityStore<ProjectState> {

  constructor() {
    super();
  }

}

