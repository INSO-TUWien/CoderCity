import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as GitReducer from '../timeline/gitgraph/git.reducer';

export interface State {
  git: GitReducer.State
}

export const reducers: ActionReducerMap<State> = {
  git: GitReducer.GitGraphReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
