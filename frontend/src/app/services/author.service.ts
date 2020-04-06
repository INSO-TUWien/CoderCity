import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../model/author.model';
import { GitStore } from '../state/git.store';
import { tap, map } from 'rxjs/operators';
import { getAuthorColor } from '../util/color-scheme';
import { environment } from 'src/environments/environment';

export const HOST = '/api';
export const AUTHOR_ENDPOINT = 'author/';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(
    private http: HttpClient,
    private gitStore: GitStore
  ) { }

  getAuthors() {
    this.http.get<Author[]>(environment.apiUrl + AUTHOR_ENDPOINT)
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
      }
    );
  }
}
