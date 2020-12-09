import { Injectable } from '@angular/core';
import { BlameHunk } from '../../model/blamehunk.model';
import { File } from '../../model/file.model';
import { Directory } from '../../model/directory.model';
import { Commit } from '../../model/commit.model';
import { CommitService } from '../../services/commit.service';
import { CommitTimeInterval } from '../../components/timeline/commit-timeinterval';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectChooserComponent } from '../../components/project-chooser/project-chooser.component';
import { VisualizationStore } from './visualization.store';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor(
    private visualizationStore: VisualizationStore,
    private commitService: CommitService,
    private modalService: NgbModal,
  ) { }

  openProjectSelectionModal() {
    this.modalService.open(ProjectChooserComponent);
  }

  // Sets selected object in the codecity.
  setSelectedObject(object: BlameHunk): void {
    this.visualizationStore.update(state =>  ({
      ...state,
      selectedObject: object
    }));
  }

  setFiles(files: File[]): void {
    this.visualizationStore.update(state =>  ({
      ...state,
      files: files
    }));
  }

  setIsFilterViewActive(value: boolean): void {
    this.visualizationStore.update(state  => ({
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

    if (commit != null) {
      // Load project snapshot at this commit.
      this.commitService.getProjectFilesAtCommit(commit).subscribe(
        directory => {
          this.setProjectFiles(directory);
        }
      );

      // Load project files
      this.commitService.getFilesAtCommit(commit).subscribe(
        files => {
          // Get all files and set files in store
          this.setFiles(files);
        }
      )
    }
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
