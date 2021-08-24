import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import { CommitTimeInterval } from 'src/app/components/timeline/commit-timeinterval';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Commit } from 'src/app/model/commit.model';
import { Directory } from 'src/app/model/directory.model';
import { File } from 'src/app/model/file.model';


export interface VisualizationState {
  selectedObject: BlameHunk;
  files: File[];
  projectFiles: Directory;
  commitPreview: Commit;
  selectedCommit: Commit;
  selectedCommitInterval: CommitTimeInterval;
  selectedSearchItem: string;
  isFilterViewActive: boolean;

}

export function createInitialState(): VisualizationState {
  return {
    selectedObject: null,
    files: [],
    projectFiles: null,
    commitPreview: null,
    selectedCommit: null,
    selectedSearchItem: '',
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

