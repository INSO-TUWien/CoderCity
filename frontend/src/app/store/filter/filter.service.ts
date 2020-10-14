import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Author } from 'src/app/model/author.model';
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


  excludeAuthor(author: Author) {
    this.filterStore.update(
      state => {
        const updatedExcludedAuthors = state.excludedAuthors.concat(Author.hashCode(author));
        return {
          ...state,
          excludedAuthors: updatedExcludedAuthors
        }
      }
    )
  }

  includeAuthor(author: Author) {
    this.filterStore.update(
      state => {
        return {
          ...state,
          excludedAuthors: state.excludedAuthors.filter((item) => item !== Author.hashCode(author))
        }
      }
    )
  }

  reset() {
    this.filterStore.update(
      state => ({
        ...state,
        excludedFiles: []
      })
    )
  }
}
