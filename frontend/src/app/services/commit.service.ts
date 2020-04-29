import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit } from '../model/commit.model';
import { File } from '../model/file.model';
import { Observable } from 'rxjs';
import { GitStore } from '../state/git.store';
import { Directory } from '../model/directory.model';
import { environment } from 'src/environments/environment';
import { ProjectQuery } from '../store/project/project.query';

export const HOST = '/api';
export const COMMIT_ENDPOINT = 'commit';

@Injectable({
  providedIn: 'root'
})
export class CommitService {

  private projectId;

  constructor(
    private http: HttpClient,
    private gitStore: GitStore,
    private projectQuery: ProjectQuery
  ) {
    projectQuery.selectActiveId().subscribe(id => {
      if (id != null) {
        this.projectId = id;
      }
    });
  }

  getFilesAtCommit(commit: Commit): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl  + '/project/' + this.projectId + '/' + COMMIT_ENDPOINT + '/' + commit.commitId);
  }

  getProjectFilesAtCommit(commit: Commit): Observable<Directory> {
    return this.http.get<Directory>(environment.apiUrl
      + `/project/${this.projectId}/` + COMMIT_ENDPOINT
      + '/' + commit.commitId + `?mode=directory`);
  }

  getCommitIdsBetween(firstCommitId: string, endCommitId: string): Observable<string[]> {
    return this.http.get<string[]>(environment.apiUrl
      + `/project/${this.projectId}/` + COMMIT_ENDPOINT + `?start=${firstCommitId}&end=${endCommitId}` );
  }

  setPreviewCommit(commit: Commit): void {
    this.gitStore.update((state) => ({
      ...state,
      commitPreview: commit
    }));
  }
}
