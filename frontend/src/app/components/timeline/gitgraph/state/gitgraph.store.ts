import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AbstractGraphCommit } from '../gitgraph/elements/abstract-graph-commit';
import { BranchTag } from './gitgraph.query';

export interface GitgraphState {
  graphCommits: Map<string, AbstractGraphCommit>;
  branchTags: BranchTag[];
}

export function createInitialState(): GitgraphState {
  return {
    graphCommits: new Map(),
    branchTags: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'gitgraph' })
export class GitgraphStore extends Store<GitgraphState> {

  constructor() {
    super(createInitialState());
  }

}

