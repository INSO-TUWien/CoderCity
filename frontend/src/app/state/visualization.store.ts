import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { BlameHunk } from '../model/blamehunk.model';
import { File } from '../model/file.model';
import { Directory } from '../model/directory.model';
import { Commit } from '../model/commit.model';
import { CommitTimeInterval } from '../components/timeline/commit-timeinterval';

export interface VisualizationState {
  selectedObject: BlameHunk;
  files: File[];
  projectFiles: Directory;
  selectedCommit: Commit;
  selectedCommitInterval: CommitTimeInterval;
  isFilterViewActive: boolean;
}

export function createInitialState(): VisualizationState {
  return {
    selectedObject: null,
    files: [],
    projectFiles: null,
    selectedCommit: null,
    selectedCommitInterval: {
      start: null,
      end: null
    },
    isFilterViewActive: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'visualization' })
export class VisualizationStore extends Store<VisualizationState> {

  constructor() {
    super(createInitialState());
  }

}

