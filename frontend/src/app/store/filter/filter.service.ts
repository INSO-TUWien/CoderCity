import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { FilterStore } from './filter.store';

@Injectable({ providedIn: "root" })
export class FilterService {

  constructor(private filterStore: FilterStore) {
  }

  addExcludedFile(fileName: string) {
    this.filterStore.update(
      state => ({
        ...state,
        excludedFiles: state.excludedFiles.add(fileName)
      })
    )
  }

  // removeExcludedFiles(fileName: string) {
  //   this.filterStore.update(
  //     state => ({
  //       ...state,
  //       excludedFiles: state.excludedFiles.delete(fileName)
  //     })
  //   )
  // }
}

