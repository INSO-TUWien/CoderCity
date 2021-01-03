import { Injectable } from '@angular/core';
import { BlameHunk } from '../../model/blamehunk.model';
import { File } from '../../model/file.model';
import { Directory } from '../../model/directory.model';
import { Commit } from '../../model/commit.model';
import { CommitTimeInterval } from '../../components/timeline/commit-timeinterval';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectChooserComponent } from '../../components/project-chooser/project-chooser.component';
import { VisualizationStore } from './visualization.store';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProjectQuery } from '../project/project.query';

export const COMMIT_ENDPOINT = 'commit';
@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  private projectId;

  constructor(
    private visualizationStore: VisualizationStore,
    private modalService: NgbModal,
    private http: HttpClient,
    private projectQuery: ProjectQuery,
  ) {
    // Get id of active project
    projectQuery.selectActiveId().subscribe(id => {
      if (id != null) {
        // Set Selected Commit to None after project load.
        this.setSelectedCommit(null);
        this.projectId = id;
      }
    });
  }

  openProjectSelectionModal() {
    this.modalService.open(ProjectChooserComponent);
  }

  reset() {
    this.visualizationStore.reset();
  }

  // Sets selected object in the codecity.
  setSelectedObject(object: BlameHunk): void {
    this.visualizationStore.update(state => ({
      ...state,
      selectedObject: object
    }));
  }

  setFiles(files: File[]): void {
    this.visualizationStore.update(state => ({
      ...state,
      files: files
    }));
  }

  setIsFilterViewActive(value: boolean): void {
    this.visualizationStore.update(state => ({
      ...state,
      isFilterViewActive: value
    }));
  }

  setProjectFiles(directory: Directory): void {
    this.visualizationStore.update(state => ({
      ...state,
      projectFiles: directory
    }));
  }

  setSelectedCommit(commit: Commit): void {
    this.visualizationStore.update(state => ({
      ...state,
      selectedCommit: commit
    }));

    this.loadProjectDataAtCommit(commit);
  }

  /**
   * Loads project data for selected commit
   */
  private loadProjectDataAtCommit(commit: Commit) {
    if (commit != null) {
      this.visualizationStore.setLoading(true);
      // Load project snapshot of the specified commit.
      this.getProjectFilesAtCommit(commit).subscribe(
        directory => {
          this.setProjectFiles(directory);
          this.visualizationStore.setLoading(false);
        }
      );

      // Load list of project files
      this.getFilesAtCommit(commit).subscribe(
        files => {
          // Get all files and set files in store
          this.setFiles(files);
        }
      )
    }
  }

  // Loads array of project files without preserving folder structure
  private getFilesAtCommit(commit: Commit): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl + '/project/' + this.projectId + '/' + COMMIT_ENDPOINT + '/' + commit.commitId + '/files');
  }

  // Loads project files while preserving folder structure
  private getProjectFilesAtCommit(commit: Commit): Observable<Directory> {
    return this.http.get<Directory>(environment.apiUrl
      + `/project/${this.projectId}/` + COMMIT_ENDPOINT
      + '/' + commit.commitId);
  }

  setCommitPreview(commit: Commit) {
    this.visualizationStore.update((state) => ({
      ...state,
      commitPreview: commit
    }));
  }

  setSelectedCommitInterval(commitInterval: CommitTimeInterval): void {
    this.visualizationStore.update(state => ({
      ...state,
      selectedCommitInterval: commitInterval
    }));
  }

  /**
   * Sets selected item of universal search
   * @param item selected search item
   */
  setSelectedSearchItem(item: string) {
    this.visualizationStore.update(state => ({
      ...state,
      selectedSearchItem: item
    }))
  }
}
