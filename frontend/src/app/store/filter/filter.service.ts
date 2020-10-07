import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { FilterStore } from './filter.store';

@Injectable({ providedIn: "root" })
export class FilterService {

  constructor(private filterStore: FilterStore) {
  }

  excludeFile(fileName: string) {
    this.filterStore.update(
      state => {
        const updatedExcludedFiles = state.excludedFiles.concat(fileName);
        return {
          ...state,
          excludedFiles: updatedExcludedFiles
        }
      }
    )
  }

  includeFile(fileName: string) {
    this.filterStore.update(
      state => {
        return {
          ...state,
          excludedFiles: state.excludedFiles.filter((item) => item !== fileName)
        }
      }
    )
  }
}
