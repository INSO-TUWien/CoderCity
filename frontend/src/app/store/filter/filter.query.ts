import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { FilterStore, FilterState } from './filter.store';


@Injectable({ providedIn: 'root' })
export class FilterQuery extends Query<FilterState> {

  constructor(protected store: FilterStore) {
    super(store);
  }

  excludedAuthors$ = this.select(store => store.excludedAuthors);
  excludedFiles$ = this.select(store => store.excludedFiles);
  fileSearchTerm$ = this.select(store => store.fileSearchString);
  selectedCommitIntervalCommits$ = this.select(state => state.selectedCommitIntervalCommits);

}