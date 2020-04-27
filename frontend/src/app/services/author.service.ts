import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../model/author.model';
import { GitStore } from '../state/git.store';
import { tap, map } from 'rxjs/operators';
import { getAuthorColor } from '../util/color-scheme';
import { environment } from 'src/environments/environment';
import { VisualizationStore } from '../state/visualization.store';
import { ProjectQuery } from '../components/project-chooser/state/project.query';

export const HOST = '/api';
export const AUTHOR_ENDPOINT = 'author/';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private projectId;

  constructor(
    private http: HttpClient,
    private gitStore: GitStore,
    private visualizationStore: VisualizationStore,
    private projectQuery: ProjectQuery
  ) {
    projectQuery.selectActiveId().subscribe(id => {
      if (id != null) {
        this.projectId = id;
      }
    });
  }

  getAuthors() {
    this.http.get<Author[]>(environment.apiUrl + `/project/${this.projectId}/` + AUTHOR_ENDPOINT)
    .pipe(
      map(authors => {
        return authors.map((a, index) => ({ color: getAuthorColor(index), email: a.email, name: a.name }));
      })
    )
    .subscribe(
      (authors) => {
        this.gitStore.update(state => ({
          ...state,
          authors
        }));
        // Create color map for each hash of an author
        const colorMap = new Map<string, string>();
        authors.forEach(author => {
          colorMap.set(Author.hashCode(author), author.color);
        });
        this.visualizationStore.update(state => ({
          ...state,
          authorColorMap: colorMap
        }));
      }
    );
  }
}
