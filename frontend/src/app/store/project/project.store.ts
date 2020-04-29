import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { ProjectData } from './projectdata';

export interface ProjectState extends EntityState<Project>, ActiveState {
  projectData: ProjectData;
}

const initialState = {
  active: null,
  projectData: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'project' })
export class ProjectStore extends EntityStore<ProjectState> {

  constructor() {
    super();
  }
}

