import { Action, createReducer, on } from '@ngrx/store';
import * as GitActions from './git.action';
import { Commit } from './datastructure/commit.model';
import { Branch } from './datastructure/branch.model';

export interface State {
  commits: Commit[];
  branches: Branch[];
}

export const initialState: State = {
    commits: [],
    branches: []
};

const exampleCommit = new Commit(
    '123',
    'Author',
    'mail@mail.com',
    new Date().toISOString(),
    'Commit 1',
    []
);

export const GitGraphReducer = createReducer(
    initialState,
/*     on(GitActions.fetchCommits, (state) => {
        return {
            ...state,
            commits: [...state.commits, exampleCommit]
        };
    }), */
    on(GitActions.loadCommitsSuccess, (state, { commits }) => {
        console.log(`reducer loadCommitsSuccess: State: ${JSON.stringify(state)} Payload ${JSON.stringify(commits)}`);
        return {
            ...state,
            commits: commits
        };
    }),
    on(GitActions.loadBranchesSuccess, (state, { branches }) => {
        console.log(`reducer loadBranchesSuccess: State: ${JSON.stringify(state)} Payload ${JSON.stringify(branches)}`);
        return {
            ...state,
            branches: branches
        };
    })
);
