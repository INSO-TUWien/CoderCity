import { Action, createReducer, on } from '@ngrx/store';
import * as GitActions from './git.action';
import { Commit } from 'src/app/shared/git/commit.model';
import { Branch } from 'src/app/shared/git/branch.model';

export interface State {
  commits: Commit[];
  branches: Branch[];
  commitPreview: Commit;
}

export const initialState: State = {
    commits: [],
    branches: [],
    commitPreview: null
};

const exampleCommit = new Commit(
    '123',
    'Author',
    'mail@mail.com',
    new Date(),
    'Commit 1',
    []
);

export const GitGraphReducer = createReducer(
    initialState,
    on(GitActions.loadCommitsSuccess, (state, { commits }) => {
        // console.log(`reducer loadCommitsSuccess: State: ${JSON.stringify(state)} Payload ${JSON.stringify(commits)}`);
        return {
            ...state,
            commits: commits
        };
    }),
    on(GitActions.loadBranchesSuccess, (state, { branches }) => {
        // console.log(`reducer loadBranchesSuccess: State: ${JSON.stringify(state)} Payload ${JSON.stringify(branches)}`);
        return {
            ...state,
            branches: branches
        };
    }),
    on(GitActions.setCommitPreview, (state, { commitPreview }) => {
        return {
            ...state,
            commitPreview: commitPreview
        };
    }),
);
