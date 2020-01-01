import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { GitService } from './git.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { GitActionTypes } from 'src/app/timeline/gitgraph/git.action';
import { EMPTY } from 'rxjs';

@Injectable()
export class GitEffects {

    @Effect() loadCommits$ = this.actions$
        .pipe(
            ofType(GitActionTypes.FETCH_COMMITS),
            mergeMap(() => this.gitService.getGitCommits()
                .pipe(
                    map(commits => {
                        console.log(`GitEffects commits ${JSON.stringify(commits)}`);
                        return { type: GitActionTypes.LOAD_COMMITS_SUCCESS, commits }
                    }),
                    catchError((error) => {
                        console.log(`GitEffects error ${JSON.stringify(error)}`);
                        return EMPTY;
                    })
                )
            )
        );

    @Effect() loadBranches$ = this.actions$
        .pipe(
            ofType(GitActionTypes.LOAD_BRANCHES),
            mergeMap(() => this.gitService.getGitBranches()
                .pipe(
                    map(branches => {
                        console.log(`GitEffects: loadBranches ${JSON.stringify(branches)}`);
                        return { type: GitActionTypes.LOAD_BRANCHES_SUCCESS, branches }
                    }),
                    catchError((error) => {
                        console.log(`GitEffects: loadBranches: ERROR ${JSON.stringify(error)}`);
                        return EMPTY;
                    })
                )
            )
        );

    constructor(
        private actions$: Actions,
        private gitService: GitService
    ) {}
}
