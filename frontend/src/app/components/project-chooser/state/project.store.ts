import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';

export interface ProjectState extends EntityState<Project>, ActiveState {}

const initialState = {
  active: null
};
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'project' })
export class ProjectStore extends EntityStore<ProjectState> {

  constructor() {
    super();
  }

}

