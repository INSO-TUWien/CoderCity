import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit } from '../model/commit.model';
import { File } from '../model/file.model';
import { Observable } from 'rxjs';
import { GitStore } from '../state/git.store';
import { VisualizationService } from './visualization.service';
import { Directory } from '../model/directory.model';
import { environment } from 'src/environments/environment';

export const HOST = '/api';
export const COMMIT_ENDPOINT = 'commit/';

@Injectable({
  providedIn: 'root'
})
export class CommitService {

  constructor(
    private http: HttpClient,
    private gitStore: GitStore
  ) { }

  getFilesAtCommit(commit: Commit): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl  + COMMIT_ENDPOINT + commit.commitId);
  }

  getProjectFilesAtCommit(commit: Commit): Observable<Directory> {
    return this.http.get<Directory>(environment.apiUrl  + COMMIT_ENDPOINT + commit.commitId + `?mode=directory`);
  }

  setPreviewCommit(commit: Commit): void {
    this.gitStore.update((state) => ({
      ...state,
      commitPreview: commit
    }));
  }
}
