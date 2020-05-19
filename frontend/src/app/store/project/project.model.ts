import { ID } from '@datorama/akita';

export interface Project {
  id: ID;
  name: string;
  fullPath: string;
}

export function createProject(params: Partial<Project>) {
  return { } as Project;
}
