import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Commit } from '../model/commit.model';
import { Branch } from '../model/branch.model';
import { Author } from '../model/author.model';

export interface GitState {
  commits: Commit[];
  commitsMap: Map<string, Commit>;
  branches: Branch[];
  authors: Author[];
  commitPreview: Commit;
}

export function createInitialState(): GitState {
  return {
    commits: [],
    commitsMap: new Map(),
    branches: [],
    authors: [],
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

