import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { ProjectData } from './projectdata';
import { Commit } from 'src/app/model/commit.model';

export interface ProjectState extends EntityState<Project>, ActiveState {
  projectData: ProjectData;
  commitMap: Map<string, Commit>;
  authorColorMap: Map<string, string>;
}

const initialState = {
  active: null,
  projectData: null,
  commitMap: null,
  authorColorMap: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'project' })
export class ProjectStore extends EntityStore<ProjectState> {

  constructor() {
    super();
  }
}

