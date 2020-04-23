import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit } from '../model/commit.model';
import { map, tap } from 'rxjs/operators';
import { Branch } from '../model/branch.model';
import { GitStore } from '../state/git.store';
import { AuthorService } from './author.service';
import { environment } from 'src/environments/environment';
import { TimelineService } from '../components/timeline/timeline.service';

@Injectable({
  providedIn: 'root'
})
export class GitService {

  constructor(
    private httpClient: HttpClient,
    private authorService: AuthorService,
    private timelineServie: TimelineService,
    private gitStore: GitStore
  ) { }

  loadData(): void {
    this.getBranches();
    this.getCommits();
  }

  getCommits() {
    return this.httpClient
    .get<Commit[]>(environment.apiUrl + '/commit')
    .pipe(
      map(val =>
        val.map((commit) => {
          commit.date = new Date(commit.date);
          return commit;
        })
      ),
      tap(() => {
        this.authorService.getAuthors();
      }),
      tap((commits) => {
        if (commits.length > 0) {
          const firstCommitDate = commits[0].date;
          const lastCommitDate = commits[commits.length - 1].date;
          this.timelineServie.updateProjectInterval({
            start: firstCommitDate,
            end: lastCommitDate
          });
        }
      }),
      tap((commits) => {
        const mappedCommits = new Map<string, Commit>();
        commits.forEach((commit) => {
          mappedCommits.set(commit.commitId, commit);
        });
        this.gitStore.update(state => ({
          ...state,
          commitsMap: mappedCommits
        }));
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
      environment.apiUrl  + '/branch'
    ).subscribe((branches) => {
      this.gitStore.update(state => ({
        ...state,
        branches
      }));
    });
  }
}
