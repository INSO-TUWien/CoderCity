import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FilterState {
  deselectedFiles: string[];
  excludedFiles: Set<string>;
}

export function createInitialState(): FilterState {
  return {
    deselectedFiles: [],
    excludedFiles: new Set<string>()
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filter' })
export class FilterStore extends Store<FilterState> {
  
  constructor() {
    super(createInitialState());
  }

}
