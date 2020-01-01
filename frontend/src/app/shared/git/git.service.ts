import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commit } from './commit.model';
import { Branch } from 'src/app/timeline/gitgraph/datastructure/branch.model';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  private HOST_URL = '/api';

  constructor(private httpClient: HttpClient) { }

  getGitCommits(): Observable<Commit[]> {
    return this.httpClient.get<Commit[]>(this.HOST_URL + '/git/commits');
  }

  getGitBranches(): Observable<Branch[]> {
    return this.httpClient.get<Branch[]>(this.HOST_URL + '/git/branches');
  }
}
