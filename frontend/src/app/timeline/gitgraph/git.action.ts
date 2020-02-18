import { createAction, props } from '@ngrx/store';
import { Commit } from 'src/app/shared/git/commit.model';
import { Branch } from 'src/app/shared/git/branch.model';

export enum GitActionTypes {
  FETCH_COMMITS = '[Git] Fetch Commits',
  LOAD_COMMITS_SUCCESS = '[Git] Load Commits Success',
  LOAD_COMMITS_FAILURE = '[Git] Load Commits Failure',
  LOAD_BRANCHES = '[Git] Load Branches',
  LOAD_BRANCHES_SUCCESS = '[Git] Load Branches Success',
  LOAD_BRANCHES_FAILURE = '[Git] Load Branches Failure',
  SET_COMMIT_PREVIEW = '[Git] Set Commit Preview',
}

export const fetchCommits = createAction(
  GitActionTypes.FETCH_COMMITS
);

export const loadCommitsSuccess = createAction(
  GitActionTypes.LOAD_COMMITS_SUCCESS,
  props<{ commits: Commit[]}>()
);

export const loadCommitsFailure = createAction(
  GitActionTypes.LOAD_COMMITS_FAILURE
);

export const loadBranches = createAction(
  GitActionTypes.LOAD_BRANCHES
);

export const loadBranchesSuccess = createAction(
  GitActionTypes.LOAD_BRANCHES_SUCCESS,
  props<{ branches: Branch[]}>()
);

export const loadBranchesFailure = createAction(
  GitActionTypes.LOAD_BRANCHES_FAILURE
);

export const setCommitPreview = createAction(
  GitActionTypes.SET_COMMIT_PREVIEW,
  props<{ commitPreview: Commit}>()
);
