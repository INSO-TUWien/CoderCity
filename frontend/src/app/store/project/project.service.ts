import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { ProjectStore } from "./project.store";
import { Project } from "./project.model";
import { tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ProjectData } from "./projectdata";
import { Commit } from 'src/app/model/commit.model';
import { TimelineService } from 'src/app/components/timeline/timeline.service';
import { Author } from 'src/app/model/author.model';
import { getAuthorColor } from 'src/app/util/color-scheme';
import { VisualizationService } from "../visualization/visualization.service";

@Injectable({ providedIn: "root" })
export class ProjectService {
  constructor(
      private projectStore: ProjectStore,
      private timelineService: TimelineService,
      private http: HttpClient
    ) {}

  get() {
    return this.http.get<Project[]>(`${environment.apiUrl}/project`).pipe(
      tap((entities) => {
        this.projectStore.set(entities);
      })
    );
  }

  // Calculates and assigns individual color values of authors. 
  // Authors with the same name or email  are given the same color.
  private assignColors(authors: Author[]): Author[] {
    let result: Author[] = [];
    authors.forEach((a,i) => {
      let color = result.find((existingAuthor) => existingAuthor.name == a.name || existingAuthor.email == a.email)?.color;
      if (color == null) {
        color = getAuthorColor(i);
      }
      result.push({
        color: color,
        email: a.email, 
        name: a.name 
      });
    });
    return result;
  }

  async loadProjectData(projectId: string) {
    this.http
      .get<ProjectData>(`${environment.apiUrl}/project/${projectId}`)
      .pipe(
        map(val =>
          // Transform date string to date object
          ({
            ...val,
            commits: val.commits.map((commit) => {
              commit.date = new Date(commit.date);
              return commit;
            })
          })
        ),
        map(val => {
          const authors = val?.authors;
          return ({
            ...val,
            authors: this.assignColors(authors)
          });
        }),
        tap((val) => {
          const authors = val?.authors;
          const colorMap = new Map<string, string>();
          authors.forEach(author => {
            colorMap.set(Author.hashCode(author), author.color);
          });
          this.projectStore.update(state => ({
            ...state,
            authorColorMap: colorMap
          }));
        }),
        tap((val) => {
          // Set project interval in timeline service
          const commits = val?.commits;
          if (commits.length > 0) {
            const firstCommitDate = commits[0].date;
            const lastCommitDate = commits[commits.length - 1].date;
            this.timelineService.updateProjectInterval({
              start: firstCommitDate,
              end: lastCommitDate
            });
          }
        }),
        tap((val) => {
          const commits = val?.commits;
          const mappedCommits = new Map<string, Commit>();
          commits.forEach((commit) => {
            mappedCommits.set(commit.commitId, commit);
          });
          this.projectStore.update(state => ({
            ...state,
            commitMap: mappedCommits
          }));
        }),
        map((data) => ({
          ...data,
          // Sort commits by commit data ascending.
          commits: (data?.commits != null)
            ? data.commits.sort((a: Commit, b: Commit) => a.date.getTime() - b.date.getTime())
            : null
        }))
      ).subscribe(
        (projectData) => {
          this.projectStore.update((state) => ({
            ...state,
            projectData,
          }));
        }
      );
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

  setActive(id: ID) {
    this.projectStore.reset();
    this.projectStore.setActive(id);
    if (id !== null) {
      this.loadProjectData(id as string);
    }
  }

  updateAuthorColor(author: Author, color: string) {
    this.projectStore.update(
      (state) => {
        const authorColorMap = state.authorColorMap;
        const projectData = state.projectData;
        const updatedProjectData = {
          ...projectData,
          authors:  projectData.authors.map((a, i) => {
            if (Author.hashCode(a) === Author.hashCode(author)) {
              // Update author item with color
              return {
                ...a,
                color: color
              };
            } else {
              // Do not change color
              return a;
            }
          })
        }

        authorColorMap.set(Author.hashCode(author), color);
        return ({
          ...state,
          projectData: updatedProjectData,
          authorColorMap: authorColorMap
        });
      }
    )
  }
}
