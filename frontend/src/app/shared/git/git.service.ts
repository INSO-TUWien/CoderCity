import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commit } from './commit.model';
import { map } from 'rxjs/operators';
import { Branch } from './branch.model';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private HOST_URL = '/api';

  constructor(private httpClient: HttpClient) { }

  getGitCommits(): Observable<Commit[]> {
    return this.httpClient
      .get<Commit[]>(this.HOST_URL + '/git/commits')
      .pipe(
        map(val =>
          val.map((commit) => {
            commit.date = new Date(commit.date);
            return commit;
          })
        )
      );
  }

  getGitBranches(): Observable<Branch[]> {
    return this.httpClient.get<Branch[]>(this.HOST_URL + '/git/branches');
  }
}
