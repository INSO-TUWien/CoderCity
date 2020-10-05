import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { FilterStore } from './filter.store';

@Injectable({ providedIn: "root" })
export class FilterService {

  constructor(private filterStore: FilterStore) {
  }

}

