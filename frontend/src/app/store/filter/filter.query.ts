import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { FilterStore, FilterState } from './filter.store';


@Injectable({ providedIn: 'root' })
export class FilterQuery extends Query<FilterState> {

  constructor(protected store: FilterStore) {
    super(store);
  }

  excludedFiles$ = this.select(store => store.excludedFiles);
}