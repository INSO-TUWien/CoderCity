import { Injectable } from '@angular/core';
import { VisualizationStore } from '../state/visualization.store';
import { BlameHunk } from '../model/blamehunk.model';
import { File } from '../model/file.model';
import { Directory } from '../model/directory.model';
import { Commit } from '../model/commit.model';
import { CommitService } from './commit.service';
import { CommitTimeInterval } from '../components/timeline/commit-timeinterval';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor(
    private visualizationStore: VisualizationStore,
    private commitService: CommitService
  ) { }

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
      this.commitService.getProjectFilesAtCommit(commit).subscribe(
        directory => {
          this.setProjectFiles(directory);
        }
      );
    }
  }

  setSelectedCommitInterval(commitInterval: CommitTimeInterval): void {
    this.visualizationStore.update(state => ({
      ...state,
      selectedCommitInterval: commitInterval
    }));
  }
}
