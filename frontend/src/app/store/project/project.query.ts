import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { ProjectStore, ProjectState } from "./project.store";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class ProjectQuery extends QueryEntity<ProjectState> {
  projectData$ = this.select((state) => state.projectData);
  authors$ = this.select((state) => state.projectData?.authors);
  branches$ = this.select((state) => state.projectData?.branches);
  commits$ = this.select((state) => state.projectData?.commits);
  commitMap$ = this.select((state) => state.commitMap);
  authorColorMap$ = this.select((state) => state.authorColorMap);
  
  sortedCommits$ = this.commits$.pipe(
    map((val) =>
      val != null
        ? val.sort((a, b) => a.date.getTime() - b.date.getTime())
        : null
    )
  );

  constructor(protected store: ProjectStore) {
    super(store);
  }
}
