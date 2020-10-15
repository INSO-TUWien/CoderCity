import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Commit } from 'src/app/model/commit.model';

export interface GitState {
  commitPreview: Commit;
}

export function createInitialState(): GitState {
  return {
    commitPreview: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'git' })
export class GitStore extends Store<GitState> {

  constructor() {
    super(createInitialState());
  }

}

