import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit } from '../model/commit.model';
import { map, tap } from 'rxjs/operators';
import { Branch } from '../model/branch.model';
import { GitStore } from '../state/git.store';
import { AuthorService } from './author.service';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private HOST_URL = '/api';

  constructor(
    private httpClient: HttpClient,
    private authorService: AuthorService,
    private gitStore: GitStore
  ) { }

  getCommits() {
    return this.httpClient
    .get<Commit[]>(this.HOST_URL + '/commit')
    .pipe(
      map(val =>
        val.map((commit) => {
          commit.date = new Date(commit.date);
          return commit;
        })
      ),
      tap(() => {
        this.authorService.getAuthors();
      })
    ).subscribe(commits => {
      this.gitStore.update(state => ({
        ...state,
        commits
      }));
    });
  }

  getBranches() {
    return this.httpClient.get<Branch[]>(
      this.HOST_URL + '/branch'
    ).subscribe((branches) => {
      this.gitStore.update(state => ({
        ...state,
        branches
      }));
    });
  }
}