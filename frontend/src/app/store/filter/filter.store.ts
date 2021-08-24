import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FilterState {
  excludedFiles: string[];
  excludedAuthors: string[];
  fileSearchString: string;
  selectedCommitIntervalCommits: string[];
}

export function createInitialState(): FilterState {
  return {
    excludedFiles: [],
    excludedAuthors: [],
    fileSearchString: '',
    selectedCommitIntervalCommits: []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filter' })
export class FilterStore extends Store<FilterState> {
  
  constructor() {
    super(createInitialState());
  }

}
