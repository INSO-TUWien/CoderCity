import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { FilterFile } from './filter-file.model';

export interface FilterState {
  deselectedFiles: string[];
  files: FilterFile[];
}

export function createInitialState(): FilterState {
  return {
    deselectedFiles: [],
    files: []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filter' })
export class FilterStore extends Store<FilterState> {
  
  constructor() {
    super(createInitialState());
  }

}
