import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { ProjectStore } from './project.store';
import { Project } from './project.model';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  constructor(private projectStore: ProjectStore,
              private http: HttpClient) {
  }

  get() {
    return this.http.get<Project[]>(`${environment.apiUrl}/project`).pipe(tap(entities => {
      this.projectStore.set(entities);
    }));
  }

  add(project: Project) {
    this.projectStore.add(project);
  }

  update(id, project: Partial<Project>) {
    this.projectStore.update(id, project);
  }

  remove(id: ID) {
    this.projectStore.remove(id);
  }
}
